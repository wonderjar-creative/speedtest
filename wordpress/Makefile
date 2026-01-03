.PHONY: up down setup logs shell clean

# Start WordPress containers
up:
	docker compose up -d
	@echo ""
	@echo "WordPress starting at http://localhost:8080"
	@echo "Run 'make setup' after first start to install plugins"

# Stop containers
down:
	docker compose down

# First-time setup (install WP, plugins, theme)
setup:
	./scripts/setup.sh

# View logs
logs:
	docker compose logs -f wordpress

# Shell into WordPress container
shell:
	docker exec -it speedtest-wp bash

# WP-CLI commands
wp:
	docker exec speedtest-wpcli wp $(filter-out $@,$(MAKECMDGOALS))

# Clean everything (removes data!)
clean:
	docker compose down -v
	@echo "All containers and volumes removed"

# Restart WordPress
restart:
	docker compose restart wordpress

# Export database
export-db:
	docker exec speedtest-wpcli wp db export - > backup.sql
	@echo "Database exported to backup.sql"

# Import database
import-db:
	docker exec -i speedtest-wpcli wp db import - < backup.sql
	@echo "Database imported from backup.sql"
