# Elasticache redis free tier, no replication, no backup, single node, 1 shard, cache.t3.micro

resource "aws_elasticache_subnet_group" "ucf_attendance_redis_subnet_group" {
  name       = "ucf-attendance-redis-subnet-group"
  subnet_ids = aws_subnet.private.*.id
}

resource "aws_security_group" "ucf_attendance_redis_sg" {
  name        = "ucf-attendance-redis-sg"
  description = "UCF Attendance Redis Security Group"
  vpc_id      = aws_vpc.attendance_vpc.id
}

resource "aws_elasticache_cluster" "ucf_attendance_redis" {
  cluster_id           = "ucf-attendance-redis"
  engine               = "redis"
  engine_version       = "7.1"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7.cluster.on"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.ucf_attendance_redis_subnet_group.name
  security_group_ids   = [aws_security_group.ucf_attendance_redis_sg.id]
  tags = {
    Name = "ucf-attendance-redis"
  }
}
