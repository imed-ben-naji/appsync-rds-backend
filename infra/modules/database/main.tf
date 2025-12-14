resource "aws_db_subnet_group" "main" {
  name       = "${var.resource_prefix}-db-subnet-group"
  subnet_ids = var.database_subnet_ids

  tags = {
    Name        = "${var.resource_prefix}-db-subnet-group"
  }
}

resource "aws_security_group" "client" {
  name        = "${var.resource_prefix}-rds-client-sg"
  description = "Allow inbound database traffic"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.resource_prefix}-rds-client-sg"
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.resource_prefix}-rds-sg"
  description = "Allow inbound database traffic"
  vpc_id      = var.vpc_id

  tags = {
    Name        = "${var.resource_prefix}-rds-sg"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_client_to_rds" {
  security_group_id        = aws_security_group.rds.id
  referenced_security_group_id = aws_security_group.client.id
  from_port               = 5432
  to_port                 = 5432
  ip_protocol             = "tcp"
}

resource "aws_rds_cluster" "aurora_postgres" {
  cluster_identifier            = "${var.resource_prefix}-aurora-postgresql"
  engine                        = var.engine
  engine_version                = var.engine_version
  master_username               = var.db_master_username
  manage_master_user_password   = var.manage_master_user_password
  database_name                 = var.db_name
  backup_retention_period       = var.backup_retention_period
  preferred_backup_window       = var.preferred_backup_window
  db_subnet_group_name          = aws_db_subnet_group.main.name
  vpc_security_group_ids        = [aws_security_group.rds.id]
  performance_insights_enabled  = true
  storage_encrypted  = true
  copy_tags_to_snapshot =  true

  skip_final_snapshot = var.skip_final_snapshot

  serverlessv2_scaling_configuration {
    max_capacity = var.max_capacity
    min_capacity = var.min_capacity
  }

  tags = {
    Name = "${var.resource_prefix}-aurora-postgresql"
  }
}

resource "aws_rds_cluster_instance" "aurora_postgres_writer" {
  identifier         = "${var.resource_prefix}-aurora-postgresql-writer"
  cluster_identifier = aws_rds_cluster.aurora_postgres.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora_postgres.engine
  engine_version     = aws_rds_cluster.aurora_postgres.engine_version
  performance_insights_enabled  = true


  tags = {
    Name = "${var.resource_prefix}-aurora-postgresql-writer"
    Role = "writer"
  }
}

resource "aws_rds_cluster_instance" "aurora_postgres_reader" {
  identifier         = "${var.resource_prefix}-aurora-postgresql-reader"
  cluster_identifier = aws_rds_cluster.aurora_postgres.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora_postgres.engine
  engine_version     = aws_rds_cluster.aurora_postgres.engine_version
  performance_insights_enabled  = true


  tags = {
    Name = "${var.resource_prefix}-aurora-postgresql-reader"
    Role = "reader"
  }
}