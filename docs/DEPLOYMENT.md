# Deployment

This document provides a detailed overview of the project's deployment process.

## Table of Contents

- [Deployment](#deployment)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Deployment Environments](#deployment-environments)
  - [CI/CD Pipeline](#cicd-pipeline)
  - [Manual Deployment](#manual-deployment)

## Introduction

The project's deployment process is designed to be as simple as possible. It uses Terraform to provision the project's infrastructure, and it uses the Serverless Framework to deploy the project's application.

## Prerequisites

To get started with the project's deployment process, you'll need to have the following prerequisites installed if you plan to deploy manually:

- [AWS CLI](https://aws.amazon.com/cli/)
- [Terraform](https://www.terraform.io/)
- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/)

## Deployment Environments

The project uses the following deployment environments:

- **dev:** The development environment. (implemented to be used as example)
- **qa:** The quality assurance environment. (not implemented, would be the same as dev in this example)
- **prod:** The production environment. (not implemented, would be the same as dev in this example)

## CI/CD Pipeline

The project's CI/CD pipeline is built with GitHub Actions. The workflows in `.github/workflows` are configured to deploy automatically on push to specific branches:

- `main` branch -> Deploys to the **dev** environment. (used as example, normally would be `prod`)

## Manual Deployment

Manual deployments are handled by the `Makefile`, which simplifies the process of deploying both the infrastructure and the application.

### Deploy to Development
To deploy the infrastructure in dev:
```bash
make deploy_infra env=dev
```
This command will navigate to the `infra/environments/dev` directory, initialize Terraform, and plan and apply the infrastructure changes. (will need to be approved manually)

To deploy the application to the `dev` environment, run:
```bash
make deploy_dev
```
This command is a wrapper around the `serverless deploy --stage dev` command, as can be seen in the `app/package.json` file. It will deploy the AppSync API and Lambda functions defined in `app/serverless.yml`.

### Deploy to QA & Production
Deployment to the `qa` and `prod` environments is not implemented, because in this example it is the same as `dev`. However, the structure is in place to be added later.
