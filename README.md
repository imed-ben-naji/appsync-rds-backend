# AppSync RDS Serverless GraphQL API

A serverless GraphQL API built with AWS AppSync, containerized Lambda functions, and Amazon RDS PostgreSQL with read replicas. This project demonstrates modern cloud architecture patterns with complete local development capabilities.

[![Deploy Dev](https://github.com/imed-ben-naji/appsync-rds-backend/actions/workflows/deploy-dev.yml/badge.svg)](https://github.com/imed-ben-naji/appsync-rds-backend/actions/workflows/deploy-dev.yml)

---

## 🚀 Features

### Backend Services
- **AWS AppSync** - Managed GraphQL API with API Key authentication
- **AWS Lambda (Container Images)** - Serverless compute with Docker containers
- **Amazon RDS PostgreSQL** - Managed relational database with read replicas
  - Separate writer endpoint for mutations
  - Separate reader endpoint for queries (improved performance)
- **AWS Secrets Manager** - Secure credential management
- **AWS Systems Manager (SSM)** - Parameter store for configuration

### Infrastructure
- **VPC with Public/Private Subnets** - Secure multi-AZ network architecture
- **NAT Gateway** - Outbound internet access for Lambda functions
- **Security Groups** - Fine-grained access control
- **Bastion Host with SSM** - Secure remote database access
- **Infrastructure as Code** - 100% Terraform-managed resources

### Development & Deployment
- **Docker-based Local Development** - Complete local environment with PostgreSQL
- **CI/CD with GitHub Actions** - Automated deployments to AWS
- **Serverless Framework** - Lambda deployment and management
- **Multi-environment Support** - Dev, QA, and Production configurations

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Local Development](./docs/LOCAL_SETUP.md)
- [Secure Database Access](#secure-database-access)
- [Cleanup](#cleanup)
- [Monitoring](#monitoring)

---

## Architecture

### High-Level Architecture
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   AWS AppSync       │ ◄── API Key Authentication
│   (GraphQL API)     │
└──────┬──────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  Lambda     │   │  Lambda     │
│  (Queries)  │   │ (Mutations) │
│             │   │             │
│  Container  │   │  Container  │
└──────┬──────┘   └──────┬──────┘
       │                 │
       ▼                 ▼
   ┌────────────────────────┐
   │   Amazon RDS           │
   │   PostgreSQL           │
   │                        │
   │  ┌──────┐   ┌──────┐   │
   │  │Writer│   │Reader│   │
   │  │(R/W) │   │(R/O) │   │
   │  └──────┘   └──────┘   │
   └────────────────────────┘
```
### Key Components

**AWS AppSync**
- Managed GraphQL endpoint
- API Key authentication
- Request validation

**Lambda Functions**
- **Queries Lambda**: Handles read operations, connects to RDS reader endpoint
- **Mutations Lambda**: Handles write operations, connects to RDS writer endpoint
- Containerized for larger dependencies and faster cold starts
- Running in VPC private subnets

**Amazon RDS PostgreSQL**
- Multi-AZ deployment for high availability
- Automated backups
- Read replica for query scaling
- Encrypted at rest and in transit

**Network Architecture**
- VPC with public and private subnets across multiple AZs
- NAT Gateway for Lambda internet access
- Security groups for fine-grained access control
- No direct internet access to database

---

## 📦 Prerequisites

### Required Tools

| Tool | Version |
|------|---------|
| [AWS CLI](https://aws.amazon.com/cli/) | >= 2.x |
| [Terraform](https://www.terraform.io/) | >= 1.5.7 |
| [Node.js](https://nodejs.org/) | >= 18.x |
| [Docker](https://www.docker.com/) | >= 20.x |
| [Serverless Framework](https://www.serverless.com/) | >= 3.x |
| [Make](https://www.gnu.org/software/make/) | Any |

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/imed-ben-naji/appsync-rds-backend.git
cd appsync-rds-backend
```

### 2. Local Development Setup
```bash
# Install dependencies and build Docker images
make setup

# Start local services (PostgreSQL + Lambda containers)
make up

# Run tests
make test

# View logs
make logs

# serverless offline
make offline
```

Your local API will be available at:
- **GraphQL Endpoint**: http://localhost:20002/graphql
- **GraphiQL IDE**: http://localhost:20002
- **Lambda (Queries)**: http://localhost:9000
- **Lambda (Mutations)**: http://localhost:9001
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

### 3. Deploy to AWS
```bash
# Deploy infrastructure (first time only)
cd infra/environments/dev
terraform init
terraform apply --var-file=terraform.tfvars

# Deploy Lambda functions and AppSync API
cd ../../../
make deploy_dev
```

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy-dev.yml        # CI/CD pipeline
|       └── deploy-qa.yml         # CI/CD pipeline (not implemented)
|       └── deploy-prod.yml       # CI/CD pipeline (not implemented)
├── app/
│   ├── src/
│   │   ├── queries/index.js      # Query handlers
│   │   ├── mutations/index.js    # Mutation handlers
│   │   └── shared
|   |       └──db.js          # Database connection logic
|   |       └──utils.js       # Utility functions
│   ├── package.json              # Node.js dependencies
│   ├── schema.graphql            # GraphQL schema
│   └── serverless.yml            # Serverless Framework config
|   └── serverless.local.yml       # Serverless Framework config for local development
├── docker/
│   ├── Dockerfile.mutations      # Dockerfile for mutation lambdas
│   ├── Dockerfile.queries        # Dockerfile for query lambdas
│   └── docker-compose.yml        # Docker compose for local development
├── docs/
│   ├── API.md                    # API documentation
│   ├── LOCAL_SETUP.md            # Local development setup guide
│   └── DEPLOYMENT.md             # Deployment guide
├── infra/                        # Terraform infrastructure code
│   ├── environments/
│   │   └── dev/
│   │   |   ├── main.tf           # Main Terraform config
│   │   |   └── ...
|   |   └── prod/                # Not implemented, would be the same as dev
│   │   └── qa/                  # Not implemented, would be the same as dev
│   └── modules/
│       ├── networking/           # VPC, subnets, NAT Gateway
│       ├── database/             # Aurora PostgreSQL
│       └── bastion/              # Bastion host for DB access
├── scripts/
│   └── test-lambdas.js           # Local test script
├── Makefile                      # Main project script for local development and deployment
├── README.md                     # Project documentation
├── .gitignore
└── .dockerignore

```

## 📚 API Documentation

Complete API documentation is available in [docs/API.md](./docs/API.md).

### Quick API Examples

**Query: List all items**
```graphql
query {
  listItems {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

**Mutation: Create an item**
```graphql
mutation {
  createItem(
    name: "Sample Item"
    description: "This is a test item"
  ) {
    id
    name
    description
    createdAt
  }
}
```

**Query: Get single item**
```graphql
query {
  getItem(id: "1") {
    id
    name
    description
  }
}
```

For complete documentation including:
- All available queries and mutations
- Request/response examples
- Error handling
- Authentication
- Rate limits
- Code examples (JavaScript, cURL, Apollo Client)

See **[Complete API Documentation →](./docs/API.md)**

---

## 🚢 Deployment

### Infrastructure Deployment (First Time)
```bash
# Navigate to environment
cd infra/environments/dev

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Deploy infrastructure
terraform apply
```

### Application Deployment
```bash
# From project root
make deploy-dev

# Or manually
cd app
npm run deploy:dev
```

### CI/CD Pipeline

The project includes automated deployments via GitHub Actions:

1. **Push to main branch** → Automatically deploys to dev

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

For detailed deployment instructions, see **[Deployment Guide →](./docs/DEPLOYMENT.md)**


---

## Secure Database Access

The bastion host allows secure access to the RDS database using AWS SSM Session Manager:

```bash
# Start port forwarding session
aws ssm start-session \
  --target <bastion-instance-id> \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters '{"host":["<rds-endpoint>"],"portNumber":["5432"],"localPortNumber":["5432"]}'

# Connect with psql (in another terminal)
psql -h localhost -p 5432 -U postgres_admin -d postgres
```

To get the database password:

```bash
aws secretsmanager get-secret-value --secret-id <db-secret-arn> --query SecretString --output text | jq
```

## Cleanup

To stop and remove all local containers and volumes:
```bash
make clean
```

To destroy the cloud infrastructure, you can manually run the `terraform destroy` command in the appropriate environment directory (`infra/environments/dev`).

## Monitoring

### CloudWatch Metrics

Monitor key metrics in AWS CloudWatch:
- Lambda invocations, errors, duration
- AppSync request count, latency, errors
- RDS CPU, connections, replication lag
- VPC NAT Gateway data transfer