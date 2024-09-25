data "aws_iam_policy_document" "s3_event_notification_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }

    actions   = ["sqs:SendMessage"]
    resources = ["arn:aws:sqs:*:*:${var.app_prefix}-s3-event-notification"]

    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = ["${aws_s3_bucket.bucket.arn}"]
    }
  }
}

# SQS queue
resource "aws_sqs_queue" "queue" {
  name           = "${var.app_prefix}-s3-event-notification"
  policy         = data.aws_iam_policy_document.s3_event_notification_policy.json
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
