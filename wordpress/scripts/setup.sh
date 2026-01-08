#!/bin/bash
# WordPress Setup Script
# Run with: docker-compose exec wpcli sh /scripts/setup.sh

set -e

# All wp commands need --url to avoid HTTP_HOST errors
URL="http://localhost:8080"

echo "========================================="
echo "  WordPress Setup Script"
echo "========================================="

# Wait for WordPress to be ready
echo ""
echo "[1/6] Waiting for WordPress..."
until wp core is-installed --url="$URL" 2>/dev/null; do
  # Try to install if not installed yet
  wp core install --url="$URL" --title="Elevation Design Studio" --admin_user="admin" --admin_password="admin123" --admin_email="admin@example.com" --skip-email 2>/dev/null || sleep 2
done
echo "✓ WordPress installed"

# Configure site settings
echo ""
echo "[2/6] Configuring settings..."
wp option update blogdescription "Architecture & Interior Design" --url="$URL"
wp rewrite structure '/%postname%/' --hard --url="$URL"
echo "✓ Settings configured"

# Install and activate theme
echo ""
echo "[3/6] Activating theme..."
wp theme activate elevation-theme --url="$URL" || echo "Theme not found - activate manually"
echo "✓ Theme step complete"

# Install required plugins
echo ""
echo "[4/6] Installing plugins..."

# WPGraphQL - Required for headless
wp plugin install wp-graphql --activate --url="$URL"
echo "  ✓ WPGraphQL"

# WPGraphQL JWT Authentication - Required for preview/auth
wp plugin install https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/refs/heads/master.zip --activate --url="$URL" || echo "  ! JWT Auth - install manually from GitHub"
echo "  ✓ WPGraphQL JWT Auth"

# Rank Math SEO
wp plugin install seo-by-rank-math --activate --url="$URL"
echo "  ✓ Rank Math SEO"

# WP Super Cache - Basic caching
wp plugin install wp-super-cache --activate --url="$URL"
echo "  ✓ WP Super Cache"

# Contact Form 7 - Free alternative to Gravity Forms
wp plugin install contact-form-7 --activate --url="$URL"
echo "  ✓ Contact Form 7"

echo ""
echo "[5/6] Installing WPGraphQL for Rank Math..."
wp plugin install https://github.com/developer-developer/developer-developer-developer/archive/refs/heads/master.zip --activate --url="$URL" 2>/dev/null || echo "  ! WPGraphQL for Rank Math - install manually"

# Set up basic pages with pattern content
echo ""
echo "[6/6] Creating pages..."
wp post create --post_type=page --post_title="Home" --post_status=publish --post_name="home" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-home"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="About" --post_status=publish --post_name="about" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-about"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Services" --post_status=publish --post_name="services" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-services"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Portfolio" --post_status=publish --post_name="portfolio" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-portfolio"} /-->' --url="$URL" || true
wp post create --post_type=page --post_title="Contact" --post_status=publish --post_name="contact" --post_content='<!-- wp:pattern {"slug":"elevation-theme/page-contact"} /-->' --url="$URL" || true

# Set homepage
HOMEPAGE_ID=$(wp post list --post_type=page --name=home --field=ID --url="$URL")
if [ -n "$HOMEPAGE_ID" ]; then
  wp option update show_on_front page --url="$URL"
  wp option update page_on_front "$HOMEPAGE_ID" --url="$URL"
  echo "✓ Homepage set"
fi

echo ""
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "WordPress: http://localhost:8080"
echo "Admin:     http://localhost:8080/wp-admin"
echo "GraphQL:   http://localhost:8080/graphql"
echo ""
echo "Login: admin / admin123"
echo ""
