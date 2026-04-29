.PHONY: help up down build logs dev-comparison dev-headless install-comparison install-headless sync-tokens sync-templates sync-assets seed seed-reset seed-dump seed-import docker-build-comparison docker-build-headless docker-build-apps

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
	@echo "  sync-assets         Mirror theme assets that headless serves locally for LCP"
	@echo ""
	@echo "Docker (Next.js apps — verify prod builds locally):"
	@echo "  docker-build-comparison  Build comparison app's Docker image"
	@echo "  docker-build-headless    Build headless app's Docker image (needs WP env)"
	@echo "  docker-build-apps        Build both Next.js Docker images"
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

# Theme assets that the headless app serves locally to skip the cross-server
# fetch for LCP-critical images. Cover.tsx rewrites the slow.* URL to /<file>.
sync-assets:
	cp wordpress/theme/assets/hero.jpg apps/headless/public/hero.jpg

# Local development (outside docker)
dev-comparison:
	cd apps/comparison && npm run dev

dev-headless: sync-tokens sync-templates
	cd apps/headless && npm run dev

install-comparison:
	cd apps/comparison && npm install

install-headless:
	cd apps/headless && npm install

# Local Docker builds for the Next.js apps.
# Mirrors what Coolify does on Hetzner, on your Mac. Useful for catching
# lockfile-sync errors and prod build issues BEFORE pushing.
# Note: builds for native arch (arm64 on Apple Silicon). Add
# --platform linux/amd64 if you ever need an image deployable to Hetzner.
docker-build-comparison:
	cd apps/comparison && docker build -t comparison-local .

# Headless needs WP credentials at build time (GraphQL codegen runs in npm run build).
# Source apps/headless/.env.local before running, or pass build-args manually.
docker-build-headless:
	cd apps/headless && docker build -t headless-local \
		--build-arg NEXT_PUBLIC_BASE_URL=$${NEXT_PUBLIC_BASE_URL} \
		--build-arg NEXT_PUBLIC_WORDPRESS_API_URL=$${NEXT_PUBLIC_WORDPRESS_API_URL} \
		--build-arg HEADLESS_SECRET=$${HEADLESS_SECRET} \
		--build-arg WP_USER=$${WP_USER} \
		--build-arg WP_APP_PASS=$${WP_APP_PASS} \
		.

docker-build-apps: docker-build-comparison docker-build-headless

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
	docker compose -f wordpress/docker-compose.yml exec -T mariadb mysqldump --no-tablespaces -uwordpress -pwordpress wordpress > wordpress/seed-dump.sql
	@echo "Done. Commit wordpress/seed-dump.sql and deploy to import on production."

seed-import:
	@echo "Importing wordpress/seed-dump.sql into WordPress database..."
	docker compose -f wordpress/docker-compose.yml exec -T mariadb mysql -uwordpress -pwordpress wordpress < wordpress/seed-dump.sql
	@echo "Done. You may need to restart the WordPress container."
