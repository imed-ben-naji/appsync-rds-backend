terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    bucket = "dev-terraform-artifacts"
    key    = "serverless-rds-api/dev/terraform.tfstate"
    region = "eu-west-1"
  }
}