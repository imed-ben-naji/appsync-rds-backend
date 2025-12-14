.PHONY: help install build up down test logs clean

.DEFAULT_GOAL := help

help: ## Show help
	@echo "========================================================"
	@echo "        Serverless RDS API - Available Commands"
	@echo "========================================================"
	@echo "Available targets:"
	@echo ""
	@echo "  help                 Show help"
	@echo "  install              Install dependencies"
	@echo "  build                Build the project"
	@echo "  up                   Start services"
	@echo "  down                 Stop services"
	@echo "  test                 Run tests"
	@echo "  logs                 Show logs"
	@echo "  clean                Clean build artifacts"

install: ## Install dependencies
	cd app && npm install

build: ## Build Docker images
	cd docker && docker-compose build

up: ## Start services
	cd docker && docker-compose up -d && sleep 8

down: ## Stop services
	cd docker && docker-compose down

test: ## Run tests
	node scripts/test-lambdas.js

offline: ## Run serverless offline
	cd app && npm run offline

logs: ## View logs
	cd docker && docker-compose logs -f

status: ## Check status of services
	cd docker && docker-compose ps

deploy_dev: ## Deploy to development environment
	cd app && npm run deploy:dev

deploy_prod: ## Deploy to production environment
	cd app && npm run deploy:prod

clean: ## Clean up
	cd docker && docker-compose down -v