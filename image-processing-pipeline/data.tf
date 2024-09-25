data "terraform_remote_state" "attendance_core_infra" {
  backend = "remote"

  config = {
    organization = "attendance"
    workspaces = {
      name = "core-infra"
    }
  }
}


data "aws_subnets" "attendance_public_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.terraform_remote_state.attendance_core_infra.outputs.attendance-vpc-id]
  }

  tags = {
    Name = "attendance-public-subnet*"
  }
}
