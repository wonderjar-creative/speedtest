.PHONY: help up down build logs dev-comparison dev-headless install-comparison install-headless

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Docker:"
	@echo "  up                Start all services (docker-compose up -d)"
	@echo "  down              Stop all services"
	@echo "  build             Build docker images"
	@echo "  logs              Tail docker logs"
	@echo ""
	@echo "Development:"
	@echo "  dev-comparison    Run comparison app locally"
	@echo "  dev-headless      Run headless app locally"
	@echo "  install-comparison  Install comparison dependencies"
	@echo "  install-headless    Install headless dependencies"

# Docker commands
up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs -f

# Local development (outside docker)
dev-comparison:
	cd apps/comparison && npm run dev

dev-headless:
	cd apps/headless && npm run dev

install-comparison:
	cd apps/comparison && npm install

install-headless:
	cd apps/headless && npm install
