resource "aws_security_group" "lambda_sg" {
  name        = "${var.app_env}-lambda-sg"
  description = "Security group for lambda function"
  vpc_id      = data.aws_vpc.ucf_here_vpc.id
  egress = [{
    description      = "for all outgoing traffics"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }]
}
