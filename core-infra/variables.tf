variable "aws_region" {
  default     = "us-east-1"
  description = "The AWS region to deploy to"
}

variable "app_prefix" {
  default     = "attendance"
  description = "Common prefix for all Terraform created resources"
}
