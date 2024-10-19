resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "rds-subnet-group"
  subnet_ids = aws_subnet.private.*.id
}

resource "aws_security_group" "rds_sg" {
  name        = "rds_sg"
  description = "Allow traffic to RDS"
  vpc_id      = aws_vpc.attendance_vpc.id
}

resource "aws_db_instance" "ucf_attendance_db" {
  identifier                  = "ucf-attendance-db"
  allocated_storage           = 20
  storage_type                = "gp3"
  engine                      = "postgres"
  engine_version              = "16.3"
  instance_class              = "db.t2g.micro"
  username                    = "postgres"
  manage_master_user_password = true
  parameter_group_name        = "default.postgres16"
  publicly_accessible         = false
  vpc_security_group_ids      = [aws_security_group.rds_sg.id]
  db_subnet_group_name        = aws_db_subnet_group.db_subnet_group.name
  tags = {
    Name = "ucf-attendance-db"
  }
}
