.PHONY: help install build up down test logs clean offline status deploy_dev deploy_prod


.DEFAULT_GOAL := help

help: ## Show help
	@echo "========================================================"
	@echo "        Serverless RDS API - Available Commands"
	@echo "========================================================"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "--- Development ---"
	@echo "  install              Install NPM dependencies"
	@echo "  offline              Run serverless offline mode"
	@echo ""
	@echo "--- Docker Services ---"
	@echo "  build                Build Docker images"
	@echo "  up                   Start Docker services (detached)"
	@echo "  down                 Stop Docker services"
	@echo "  up_db                Start only the database service"
	@echo "  status               Check status of containers"
	@echo "  logs                 Tail container logs"
	@echo "  test                 Run lambda integration tests"
	@echo "  clean                Stop services and remove volumes"
	@echo ""
	@echo "--- Deployment ---"
	@echo "  deploy_dev           Deploy app to DEV environment"
	@echo "  deploy_qa            Deploy app to QA environment"
	@echo "  deploy_prod          Deploy app to PROD environment"
	@echo "  deploy_infra         Deploy Terraform infrastructure"
	@echo "                       (Usage: make deploy_infra env=dev)"
	@echo ""
	@echo "--- Other ---"
	@echo "  help                 Show this help message"
	@echo "  list                 List raw command names"

list: ## List all available commands
	@echo "Available commands:"
	@echo "  help"
	@echo "  install"
	@echo "  offline"
	@echo "  build"
	@echo "  up"
	@echo "  up_db"
	@echo "  down"
	@echo "  test"
	@echo "  logs"
	@echo "  status"
	@echo "  clean"
	@echo "  deploy_dev"
	@echo "  deploy_qa"
	@echo "  deploy_prod"
	@echo "  deploy_infra"

install: ## Install dependencies
	cd app && npm install

build: ## Build Docker images
	cd docker && docker-compose build

up: ## Start services
	cd docker && docker-compose up -d && sleep 8

down: ## Stop services
	cd docker && docker-compose down

up_db: ## Start only the database service
	cd docker && docker-compose up -d postgres && sleep 5

test: ## Run tests
	node scripts/test-lambdas.js

logs: ## View logs
	cd docker && docker-compose logs -f

status: ## Check status of services
	cd docker && docker-compose ps

clean: ## Clean up
	cd docker && docker-compose down -v


offline: ## Run serverless offline
	cd app && npm run offline

deploy_dev: ## Deploy to development environment
	cd app && npm run deploy:dev

deploy_qa: ## Deploy to QA environment
	cd app && npm run deploy:qa

deploy_prod: ## Deploy to production environment
	cd app && npm run deploy:prod


deploy_infra: ## Deploy infrastructure using Terraform
	cd infra/environments/$(env) && terraform init && terraform plan && terraform apply -var-file="terraform.tfvars"