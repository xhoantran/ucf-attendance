output "attendance-vpc-id" {
  value = aws_vpc.attendance_vpc.id
}

output "attendance-vpc-public-subnet-ids" {
  value = data.aws_subnet.public.*.id
}
