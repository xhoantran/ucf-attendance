data "terraform_remote_state" "attendance_core_infra" {
  backend = "remote"

  config = {
    organization = "attendance"
    workspaces = {
      name = "core-infra"
    }
  }
}


data "aws_subnets" "attendace_public_subnets" {
  filter {
    name   = "tag:Name"
    values = ["attendance-public-subnet*"]
  }
}
