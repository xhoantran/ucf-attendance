locals {
  vpc_cidr_block = "10.0.0.0/16"
  public_subnets = {
    "${var.aws_region}a" = "10.0.101.0/24"
    "${var.aws_region}b" = "10.0.102.0/24"
  }
  private_subnets = {
    "${var.aws_region}a" = "10.0.201.0/24"
    "${var.aws_region}b" = "10.0.202.0/24"
  }
  db_subnet = {
    "${var.aws_region}a" = "10.0.301.0/24"
    "${var.aws_region}b" = "10.0.302.0/24"
  }
}

resource "aws_vpc" "attendance_vpc" {
  cidr_block = local.vpc_cidr_block
  tags = {
    Name = "${var.app_prefix}-vpc"
  }
}

resource "aws_internet_gateway" "attendance_internet_gateway" {
  vpc_id = aws_vpc.attendance_vpc.id
  tags = {
    Name = "${var.app_prefix}-internet-gateway"
  }
}

resource "aws_subnet" "public" {
  count      = length(local.public_subnets)
  cidr_block = element(values(local.public_subnets), count.index)
  vpc_id     = aws_vpc.attendance_vpc.id

  map_public_ip_on_launch = true
  availability_zone       = element(keys(local.public_subnets), count.index)

  tags = {
    Name = "${var.app_prefix}-public-subnet-${element(keys(local.public_subnets), count.index)}"
  }
}

resource "aws_subnet" "private" {
  count      = length(local.private_subnets)
  cidr_block = element(values(local.private_subnets), count.index)
  vpc_id     = aws_vpc.attendance_vpc.id

  map_public_ip_on_launch = true
  availability_zone       = element(keys(local.private_subnets), count.index)

  tags = {
    Name = "${var.app_prefix}-private-subnet-${element(keys(local.private_subnets), count.index)}"
  }
}

resource "aws_default_route_table" "public" {
  default_route_table_id = aws_vpc.attendance_vpc.main_route_table_id

  tags = {
    Name = "${var.app_prefix}-public"
  }
}

resource "aws_route" "public_internet_gateway" {
  count                  = length(local.public_subnets)
  route_table_id         = aws_default_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.attendance_internet_gateway.id

  timeouts {
    create = "5m"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(local.public_subnets)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_default_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.attendance_vpc.id

  tags = {
    Name = "${var.app_prefix}-private"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(local.private_subnets)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = aws_route_table.private.id
}
