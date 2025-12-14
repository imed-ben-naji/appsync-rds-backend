output "bastion_instance_id" {
  description = "The instance ID of the bastion host"
  value       = aws_instance.bastion.id
}

output "bastion_security_group_id" {
  description = "The security group ID of the bastion host"
  value       = aws_security_group.bastion.id
}

output "bastion_iam_role_arn" {
  description = "The IAM role ARN of the bastion host"
  value       = aws_iam_role.bastion.arn
}
