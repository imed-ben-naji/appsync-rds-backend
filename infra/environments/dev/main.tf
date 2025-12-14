locals {
  resource_name_prefix = "${var.company_name}-${var.environment}"
}

module "networking" {
  source = "../../modules/networking"

  resource_prefix       = "${local.resource_name_prefix}-vpc"
  vpc_cidr              = var.vpc_cidr
  public_subnet_cidrs   = var.public_subnet_cidrs
  private_subnet_cidrs  = var.private_subnet_cidrs
  database_subnet_cidrs = var.database_subnet_cidrs
  availability_zones    = var.availability_zones
}

module "database" {
  source = "../../modules/database"

  resource_prefix      = "${local.resource_name_prefix}-${var.project_name}-db"
  vpc_id               = module.networking.vpc_id
  database_subnet_ids  = module.networking.database_subnet_ids
  db_master_username   = var.db_master_username
  db_name              = var.db_name

  max_capacity = var.db_max_capacity
  min_capacity = var.db_min_capacity

  engine_version = data.aws_rds_engine_version.aurora_postgresql_14_8.version
  engine         = var.db_engine

  backup_retention_period     = var.db_backup_retention_period
  preferred_backup_window     = var.db_preferred_backup_window
  manage_master_user_password = true

  skip_final_snapshot = true
}

module "bastion" {
  source = "../../modules/bastion"

  resource_prefix      = "${local.resource_name_prefix}-bastion"
  vpc_id               = module.networking.vpc_id
  vpc_cidr             = var.vpc_cidr
  subnet_id            = module.networking.private_subnet_ids[0]
  aws_region           = var.aws_region
  instance_type        = "t3.micro"
  create_vpc_endpoints = true
  endpoint_subnet_ids  = module.networking.private_subnet_ids
  additional_sg_ids    = [module.database.aurora_sg_client_id]
}

resource "aws_security_group" "lambda_app" {
  name        = "${local.resource_name_prefix}-lambda-sg"
  description = "Security Group for the Lambda App"
  vpc_id      = module.networking.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [module.networking.vpc_cidr_block]
    description = "Allow all outbound traffic to VPC"
  }
}

resource "aws_ssm_parameter" "lambda_sg_id" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/lambda_sg_id"
  type  = "String"
  value = aws_security_group.lambda_app.id
}

resource "aws_ssm_parameter" "aurora_sg_client_id" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/aurora_sg_client_id"
  type  = "String"
  value = module.database.aurora_sg_client_id
}

resource "aws_ssm_parameter" "vpc_id" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/vpc_id"
  type  = "String"
  value = module.networking.vpc_id
}

resource "aws_ssm_parameter" "private_subnets" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/private_subnet_ids"
  type  = "StringList"
  value = join(",", module.networking.private_subnet_ids)
}

resource "aws_ssm_parameter" "writer_db_endpoint" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/writer_db_endpoint"
  type  = "String"
  value = module.database.writer_endpoint
}
resource "aws_ssm_parameter" "reader_db_endpoint" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/reader_db_endpoint"
  type  = "String"
  value = module.database.reader_endpoint
}

resource "aws_ssm_parameter" "db_name" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/db_name"
  type  = "String"
  value = var.db_name
}

resource "aws_ssm_parameter" "db_secret_arn" {
  name  = "/${var.company_name}/${var.project_name}/${var.environment}/infra/db_secret_arn"
  type  = "String"
  value = module.database.master_user_secret_arn
}