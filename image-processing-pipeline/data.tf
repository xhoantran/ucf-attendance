data "aws_vpc" "ucf_here_vpc" {
  id = "vpc-02636bce23dd54e6a"
}

data "aws_subnets" "ucf_here_vpc_public_subnets" {
  filter {
    name   = "tag:Name"
    values = ["attendance-subnet-public*"]
  }
}
