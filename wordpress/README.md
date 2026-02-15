# WordPress Setup

This WordPress instance serves as the shared CMS backend for both the traditional and headless frontends.

## Local Development (Docker)

### Prerequisites
- Docker Desktop installed and running

### Quick Start

```bash
cd wordpress

# Start containers
docker-compose up -d

# Run setup script (installs WordPress, plugins, creates content)
docker-compose exec wpcli sh /scripts/setup.sh
```

**WordPress:** http://localhost:8080
**Admin:** http://localhost:8080/wp-admin
**GraphQL:** http://localhost:8080/graphql

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

---

## wp-config.php Setup

The only constant you need to add to `wp-config.php` is the JWT secret for preview mode authentication:

```php
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-jwt-secret-here');
```

### Setting it via WP-CLI (recommended)

```bash
# Generate and set in one command
docker-compose exec wpcli wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "$(openssl rand -base64 64)" --type=constant --url="http://localhost:8080"
```

### Setting it manually

```bash
# Shell into the wordpress container
docker-compose exec wordpress bash
apt-get update && apt-get install -y nano
nano /var/www/html/wp-config.php

# Add this line above "/* That's all, stop editing! */"
# define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'paste-your-secret-here');
```

Generate a secret with:

```bash
openssl rand -base64 64
```

### What does NOT go in wp-config.php

| Variable | Where it lives | Notes |
|---|---|---|
| `HEADLESS_SECRET` | Next.js `.env.local` | Only needed on the Next.js side for ISR revalidation |
| `WP_USER` / `WP_APP_PASS` | Next.js `.env.local` | Created via WP Admin UI, not config files |

---

## Application Password Setup (for headless frontend)

The headless Next.js app can optionally authenticate against the WP REST API. Currently the template structure endpoint is public, so this is optional but recommended.

1. Log into **http://localhost:8080/wp-admin**
2. Go to **Users → Add New User**
3. Create a user:
   - **Username:** `frontendUser`
   - **Role:** Subscriber (read-only is sufficient)
4. Go to **Users →** click the new user → scroll to **Application Passwords**
5. Enter name: `headless-frontend` → click **Add New Application Password**
6. Copy the generated password into your Next.js `.env.local` as `WP_APP_PASS`

**What role does the user need?**
- **Subscriber** is enough for current read-only usage
- **Editor** if you later add preview/draft support
- Never needs Administrator

---

## Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers (keeps data)
docker-compose down

# Stop and DELETE all data (fresh start)
docker-compose down -v

# View logs
docker-compose logs -f

# Run WP-CLI commands
docker-compose exec wpcli wp <command>

# Shell into WordPress container
docker-compose exec wordpress bash

# Shell into WP-CLI container
docker-compose exec wpcli sh
```

> **Common mistake:** `docker-compose exec nano wp-config.php` treats `nano` as a
> service name. You need to exec into a service first, then run the command:
> `docker-compose exec wordpress bash` → then `nano wp-config.php`

---

## Theme

The Elevation Theme is a custom block theme mounted into the container from `./theme/`. Changes to theme files are reflected immediately (no rebuild needed).

### Content Created by Setup Script

| Type | Count | Details |
|------|-------|---------|
| Pages | 6 | Home, About, Services, Portfolio, Contact, Blog |
| Blog Posts | 5 | Design trends, case studies, process articles |
| Projects | 8 | Residential, commercial, hospitality portfolio items |
| Team Members | 5 | Custom post type with meta fields |
| Testimonials | 5 | Custom post type with ratings and photos |
| Navigation | 1 | Primary menu with nested dropdowns |

### Required Plugins (installed by setup script)

| Plugin | Purpose |
|--------|---------|
| WPGraphQL | GraphQL API for headless frontend |
| WPGraphQL JWT Auth | Preview mode authentication |
| Rank Math SEO | SEO metadata |
| WPGraphQL for Rank Math | Exposes SEO data via GraphQL |
| Contact Form 7 | Contact page form |
| Smart Slider 3 | Hero sliders |
| WP Super Cache | Basic page caching |

---

## Production Deployment

### Hetzner CX22 (headless backend)

WordPress runs on the same Hetzner CX22 as the headless Next.js frontend. This means GraphQL requests from Next.js to WordPress happen over localhost with zero network latency.

- **Deployment:** Coolify (self-hosted PaaS)
- **SSL:** Let's Encrypt via Coolify
- **CDN:** Cloudflare (free tier)

### Cheap Shared Hosting (traditional frontend)

The traditional WordPress site runs on intentionally modest shared hosting to represent a typical small business setup.

- **Domain:** slow.speedtest.denverheadless.com
- **Purpose:** Slow baseline for comparison demo

---

## Performance Notes

The traditional WP site is **intentionally NOT optimized**:
- No image optimization
- No CDN
- No PHP OpCache tuning
- No MySQL optimization
- No advanced caching
- No asset minification

This represents a typical $5/mo WordPress site that a small business would have.
