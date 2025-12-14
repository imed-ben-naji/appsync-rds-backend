# Local Setup

This document provides a detailed overview of the project's local setup.

## Table of Contents

- [Local Setup](#local-setup)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Troubleshooting](#troubleshooting)

## Introduction

The project's local setup is designed to be as simple as possible. It uses Docker to create a local development environment that is as close as possible to the production environment, to test the lambda functions and their interaction with the database, and use serverless-offline to simulate the AppSync API locally.

## Prerequisites

To get started with the project's local setup, you'll need to have the following prerequisites installed:

- [Terraform](https://www.terraform.io/)
- [Node.js](https://nodejs.org/)
- [Docker](httpss://www.docker.com/)
- [Serverless Framework](https://www.serverless.com/)

## Getting Started

Once you have the prerequisites installed, you can clone the repository and install the dependencies:

```bash
git clone https://github.com/imed-ben-naji/appsync-rds-backend.git
cd appsync-rds-backend
```

### 1. Installation

Install Node.js dependencies for the application:
```bash
make install
```

### 2. Run docker images (lambda functions and database) and test locally

#### a. Build Docker Images
Build the Docker images for the Lambda functions:
```bash
make build
```

#### b. Start Environment
Start the local environment, including the database and mock Lambda services:
```bash
make up
```
This will start a PostgreSQL container and containers simulating the `queries` and `mutations` Lambda functions. (test the images build and interaction locally)

#### c. Run Tests
Execute the local test script to verify the Lambda functions can connect to the database and execute queries:
```bash
make test
```

#### d. Stop Environment
Stop the local services:
```bash
make down
```

#### e. View Logs
You can view the logs of all running services:
```bash
make logs
```

#### f. Clean Environment
To stop and remove all local containers and volumes:
```bash
make clean
```

### 3. Run AppSync API locally
To run the AppSync API locally using serverless-offline, first ensure that the local database container is running, if not start it using:
```bash
make up_db
```
Then, to start the serverless-offline service, use:
```bash
make offline
```
This will start the AppSync API locally, and you can access it at ` http://172.19.0.1:20002`.
