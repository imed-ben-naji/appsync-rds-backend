variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-west-1"
}
variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "golden_recipe"
}
variable "environment" {
  description = "The deployment environment"
  type        = string
  default     = "dev"
}
variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  type        = string
}
variable "public_subnet_cidrs" {
  description = "List of CIDR blocks for public subnets"
  type        = list(string)
}
variable "private_subnet_cidrs" {
  description = "List of CIDR blocks for private subnets"
  type        = list(string)
}
variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
}

variable "database_subnet_cidrs" {
  description = "List of CIDR blocks for database subnets"
  type        = list(string)
}

variable "company_name" {
  description = "The name of the company"
  type        = string
  default     = "my_company"
}



variable "db_name" {
  description = "The name of the initial database to create"
  type        = string
}
variable "db_master_username" {
  description = "The master username for the database"
  type        = string
}

variable "db_max_capacity" {
  description = "The maximum capacity for the Aurora Serverless v2 cluster"
  type        = string
  default     = "2"
}
variable "db_min_capacity" {
  description = "The minimum capacity for the Aurora Serverless v2 cluster"
  type        = string
  default     = "1"
}

variable "db_engine" {
    description = "The database engine to use"
    type        = string
}
variable "db_backup_retention_period" {
    description = "The backup retention period for the database in days"
    type        = number
    default     = 7
}
variable "db_preferred_backup_window" {
    description = "The preferred backup window for the database"
    type        = string
    default     = "23:00-00:00"
}