variable "resource_prefix" {
  description = "Prefix for naming resources"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID where to create the bastion host"
  type        = string
}

variable "vpc_cidr" {
  description = "The CIDR block of the VPC"
  type        = string
}

variable "subnet_id" {
  description = "The subnet ID where to launch the bastion host"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for the bastion host"
  type        = string
  default     = "t3.micro"
}

variable "aws_region" {
  description = "AWS region for VPC endpoints"
  type        = string
}

variable "create_vpc_endpoints" {
  description = "Whether to create VPC endpoints for SSM (required for private subnets)"
  type        = bool
  default     = true
}

variable "endpoint_subnet_ids" {
  description = "Subnet IDs for VPC endpoints"
  type        = list(string)
  default     = []
}

variable "additional_sg_ids" {
    description = "List of additional security group IDs to attach to the bastion host"
    type        = list(string)
    default     = []
}