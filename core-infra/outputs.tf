output "attendance-vpc-id" {
  value = aws_vpc.ucf_here_vpc.id
}

output "attendance-vpc-public-subnet-ids" {
  value = data.aws_subnet.public.*.id
}
