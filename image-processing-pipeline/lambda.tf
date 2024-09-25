# Data resource to archive Lambda function code
data "archive_file" "lambda_zip" {
  source_dir  = "${path.module}/lambda/"
  output_path = "${path.module}/lambda.zip"
  type        = "zip"
}

# Lambda function policy
resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.app_prefix}-lambda-policy"
  description = "${var.app_prefix}-lambda-policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:CopyObject"
      ],
      "Effect": "Allow",
      "Resource": "${aws_s3_bucket.bucket.arn}/*"
    },
    {
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Effect": "Allow",
      "Resource": "${aws_sqs_queue.queue.arn}"
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }, 
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:*"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateNetworkInterface",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DeleteNetworkInterface"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

# Lambda function role
resource "aws_iam_role" "iam_for_terraform_lambda" {
  name               = "${var.app_prefix}-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

# Role to Policy attachment
resource "aws_iam_role_policy_attachment" "terraform_lambda_iam_policy_basic_execution" {
  role       = aws_iam_role.iam_for_terraform_lambda.id
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# # Lambda function declaration
# resource "aws_lambda_function" "sqs_processor" {
#   filename         = "lambda.zip"
#   source_code_hash = data.archive_file.lambda_zip.output_base64sha256
#   function_name    = "${var.app_prefix}-lambda"
#   role             = aws_iam_role.iam_for_terraform_lambda.arn
#   timeout          = 5
#   handler          = "index.handler"
#   runtime          = "python3.9"
#   vpc_config {
#     # Using data aws_subnets to get the subnet ids
#     subnet_ids         = data.aws_subnets.attendance_public_subnets.ids
#     security_group_ids = [aws_security_group.lambda_sg.id]
#   }
#   environment {
#     variables = {
#       BACKEND_URL = "http://10.0.15.46:9999/api/v1/image-processing-callback/"
#     }
#   }
# }

# CloudWatch Log Group for the Lambda function
resource "aws_cloudwatch_log_group" "lambda_loggroup" {
  name              = "/aws/lambda/${aws_lambda_function.sqs_processor.function_name}"
  retention_in_days = 1
}
