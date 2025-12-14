variable "resource_prefix" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "database_subnet_ids" {
  type = list(string)
}

variable "db_name" {
  type = string
}

variable "db_master_username" {
  type = string
}

variable "skip_final_snapshot" {
  description = "Skip snapshot on destroy (True for Dev, False for Prod)"
  type        = bool
  default     = true
}

variable "max_capacity" {
    description = "The maximum capacity for Aurora Serverless v2"
    type        = string
    default     = "2"
}

variable "min_capacity" {
    description = "The minimum capacity for Aurora Serverless v2"
    type        = string
    default     = "1"
}

variable "engine_version" {
  description = "The version of the database engine"
  type        = string
  default     = "13.6"
}

variable "engine" {
  description = "The database engine to use"
  type        = string
  default     = "aurora-postgresql"
}

variable "backup_retention_period" {
  description = "The days to retain backups for"
  type        = number
  default     = 7
}

variable "preferred_backup_window" {
  description = "The daily time range during which automated backups are created"
  type        = string
  default     = "23:00-00:00"
}

variable "manage_master_user_password" {
  description = "Whether to manage the master user password"
  type        = bool
  default     = true
}