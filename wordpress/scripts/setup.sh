#!/bin/bash
# WordPress setup script - run after docker compose up

set -e

echo "⏳ Waiting for WordPress to be ready..."
sleep 10

echo "📦 Installing WordPress..."
docker exec speedtest-wpcli wp core install \
  --url="http://localhost:8080" \
  --title="Elevation Design Studio" \
  --admin_user="wjmatt" \
  --admin_password="localdev123" \
  --admin_email="matt@wonderjarcreative.com" \
  --skip-email

echo "🎨 Activating theme..."
docker exec speedtest-wpcli wp theme activate elevation-theme

echo "🔌 Installing plugins..."
# WPGraphQL
docker exec speedtest-wpcli wp plugin install wp-graphql --activate

# WPGraphQL JWT Authentication
docker exec speedtest-wpcli wp plugin install \
  https://github.com/wp-graphql/wp-graphql-jwt-authentication/archive/refs/heads/develop.zip \
  --activate

# Yoast SEO (for traditional WP demo)
docker exec speedtest-wpcli wp plugin install wordpress-seo --activate

# Contact Form 7
docker exec speedtest-wpcli wp plugin install contact-form-7 --activate

echo "⚙️ Configuring permalinks..."
docker exec speedtest-wpcli wp rewrite structure '/%postname%/'

echo "🔐 Setting up JWT secret..."
docker exec speedtest-wpcli wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "$(openssl rand -base64 32)"

echo "✅ Setup complete!"
echo ""
echo "WordPress: http://localhost:8080"
echo "Admin:     http://localhost:8080/wp-admin"
echo "GraphQL:   http://localhost:8080/graphql"
echo ""
echo "Login: wjmatt / localdev123"
