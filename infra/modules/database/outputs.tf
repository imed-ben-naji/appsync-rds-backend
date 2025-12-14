output "aurora_sg_client_id" {
  description = "The security group ID for the RDS client"
  value = aws_security_group.client.id
}

output "aurora_sg_id" {
  description = "The security group ID for the RDS cluster"
  value       = aws_security_group.rds.id
}

output "writer_endpoint" {
  value = aws_rds_cluster.aurora_postgres.endpoint
  description = "Writer endpoint"
}

output "reader_endpoint" {
  value = aws_rds_cluster.aurora_postgres.reader_endpoint
  description = "Reader endpoint (load-balanced across readers)"
}

output "master_user_secret_arn" {
  value = aws_rds_cluster.aurora_postgres.master_user_secret[0].secret_arn
}
