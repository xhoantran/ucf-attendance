# SQS queue
resource "aws_sqs_queue" "queue" {
  name           = "${var.app_prefix}-s3-event-notification"
  policy         = <<POLICY
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "sqs:SendMessage",
        "Resource": "arn:aws:sqs:*:*:${var.app_prefix}-s3-event-notification-queue",
        "Condition": {
          "ArnEquals": { "aws:SourceArn": "${aws_s3_bucket.bucket.arn}" }
        }
      }
    ]
  }
  POLICY
  redrive_policy = <<POLICY
  {
    "deadLetterTargetArn": "${aws_sqs_queue.dead_letter_queue.arn}",
    "maxReceiveCount": 1
  }
  POLICY
}

resource "aws_sqs_queue" "dead_letter_queue" {
  name = "${var.app_prefix}-s3-event-notification-dlq"
}
