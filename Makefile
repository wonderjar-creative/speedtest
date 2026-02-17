.PHONY: help up down build logs dev-comparison dev-headless install-comparison install-headless sync-tokens fetch-templates

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
	@echo "  sync-tokens         Sync design tokens from theme.json to headless app"
	@echo "  fetch-templates     Fetch WP template/pattern structure to headless data/"

# Docker commands
up:
	cd wordpress/ && docker-compose up -d

down:
	cd wordpress/ && docker-compose down

build:
	cd wordpress/ && docker-compose build

logs:
	cd wordpress/ && docker-compose logs -f

# WordPress → Headless sync scripts
sync-tokens:
	node scripts/sync-theme-tokens.mjs

fetch-templates:
	node scripts/fetch-wp-template-structure.js

# Local development (outside docker)
dev-comparison:
	cd apps/comparison && npm run dev

dev-headless: sync-tokens fetch-templates
	cd apps/headless && npm run dev

install-comparison:
	cd apps/comparison && npm install

install-headless:
	cd apps/headless && npm install
