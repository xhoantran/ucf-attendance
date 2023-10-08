variable "region" {
  default     = "us-east-1"
  description = "AWS Region to deploy to"
}
variable "app_env" {
  default     = "ucf-here-demo"
  description = "Common prefix for all Terraform created resources"
}