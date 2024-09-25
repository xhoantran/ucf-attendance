output "public_subnet_ids" {
  value = data.aws_subnets.attendance_public_subnets.ids
}

output "security_group_id" {
  value = aws_security_group.lambda_sg.id
}
