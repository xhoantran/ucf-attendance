variable "aws_region" {
  default     = "us-east-1"
  description = "AWS Region to deploy to"
}

variable "app_prefix" {
  default     = "attendance"
  description = "Common prefix for all Terraform created resources"
}
