aws_region   = "eu-west-1"
project_name = "appsync-rds-backend"
environment  = "dev"
company_name = "demo"

vpc_cidr = "10.0.0.0/16"

public_subnet_cidrs = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]

private_subnet_cidrs = [
  "10.0.11.0/24",
  "10.0.12.0/24"
]

database_subnet_cidrs = [
  "10.0.21.0/24",
  "10.0.22.0/24"
]

availability_zones = [
  "eu-west-1a",
  "eu-west-1b"
]

db_name            = "items_db"
db_master_username = "postgres_admin"
db_engine          = "aurora-postgresql"
db_max_capacity    = "2"
db_min_capacity    = "0.5"
