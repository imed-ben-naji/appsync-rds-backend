output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "database_subnet_ids" {
  description = "List of database subnet IDs"
  value       = module.networking.database_subnet_ids
}

output "rds_endpoint" {
  description = "The endpoint of the RDS cluster"
  value       = module.database.endpoint
}

output "rds_secret_arn" {
  description = "The ARN of the secret containing RDS credentials"
  value       = module.database.master_user_secret_arn
  sensitive   = true
}

output "lambda_security_group_id" {
  description = "The security group ID for Lambda functions"
  value       = aws_security_group.lambda_app.id
}

output "bastion_instance_id" {
  description = "The instance ID of the bastion host for SSM Session Manager access"
  value       = module.bastion.bastion_instance_id
}
