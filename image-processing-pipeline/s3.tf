# S3 bucket
resource "aws_s3_bucket" "bucket" {
  bucket = "${var.app_prefix}-attendance-images"
}

# S3 event filter
resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.bucket.id
  queue {
    queue_arn = aws_sqs_queue.queue.arn
    events    = ["s3:ObjectCreated:*"]
  }
}

# Event source from SQS
resource "aws_lambda_event_source_mapping" "event_source_mapping" {
  event_source_arn = aws_sqs_queue.queue.arn
  enabled          = true
  function_name    = aws_lambda_function.sqs_processor.arn
  batch_size       = 1
}
