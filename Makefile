.PHONY: help up down build logs dev-comparison dev-headless install-comparison install-headless sync-tokens sync-templates seed seed-reset seed-dump seed-import

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
	@echo "  sync-templates      Sync WP template/pattern structure to headless data/"
	@echo ""
	@echo "WordPress:"
	@echo "  seed                Seed WordPress with demo content (local)"
	@echo "  seed-reset          Delete all seeded content (destructive!)"
	@echo "  seed-dump           Export seeded DB to wordpress/seed-dump.sql"
	@echo "  seed-import         Import seed-dump.sql into running WordPress DB"

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

sync-templates:
	node scripts/sync-templates.mjs

# Local development (outside docker)
dev-comparison:
	cd apps/comparison && npm run dev

dev-headless: sync-tokens sync-templates
	cd apps/headless && npm run dev

install-comparison:
	cd apps/comparison && npm install

install-headless:
	cd apps/headless && npm install

# WordPress content management
# Workflow: make seed → make seed-dump (local), then make seed-import (production)
seed:
	docker compose -f wordpress/docker-compose.yml exec wpcli sh /tmp/seed.sh

seed-reset:
	@echo "⚠ This will delete ALL posts, pages, projects, team members, and testimonials."
	@echo "Press Ctrl+C to cancel, or wait 5 seconds..."
	@sleep 5
	docker compose -f wordpress/docker-compose.yml exec wpcli sh -c '\
		wp --allow-root post delete $$(wp --allow-root post list --post_type=page --format=ids) --force 2>/dev/null; \
		wp --allow-root post delete $$(wp --allow-root post list --post_type=post --format=ids) --force 2>/dev/null; \
		wp --allow-root post delete $$(wp --allow-root post list --post_type=project --format=ids) --force 2>/dev/null; \
		wp --allow-root post delete $$(wp --allow-root post list --post_type=team_member --format=ids) --force 2>/dev/null; \
		wp --allow-root post delete $$(wp --allow-root post list --post_type=testimonial --format=ids) --force 2>/dev/null; \
		wp --allow-root post delete $$(wp --allow-root post list --post_type=wp_navigation --format=ids) --force 2>/dev/null; \
		wp --allow-root menu delete "Primary" 2>/dev/null; \
		wp --allow-root option update page_on_front 0 2>/dev/null; \
		wp --allow-root option update page_for_posts 0 2>/dev/null; \
		wp --allow-root option update show_on_front posts 2>/dev/null; \
		echo "Reset complete."'

seed-dump:
	@echo "Exporting WordPress database to wordpress/seed-dump.sql..."
	docker compose -f wordpress/docker-compose.yml exec -T db mysqldump --no-tablespaces -uwordpress -pwordpress wordpress > wordpress/seed-dump.sql
	@echo "Done. Commit wordpress/seed-dump.sql and deploy to import on production."

seed-import:
	@echo "Importing wordpress/seed-dump.sql into WordPress database..."
	docker compose -f wordpress/docker-compose.yml exec -T db mysql -uwordpress -pwordpress wordpress < wordpress/seed-dump.sql
	@echo "Done. You may need to restart the WordPress container."
