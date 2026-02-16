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
```

**WordPress:** http://localhost:8080
**Admin:** http://localhost:8080/wp-admin
**GraphQL:** http://localhost:8080/graphql

### First-Time Setup

After `docker-compose up -d`, complete the WordPress install wizard at http://localhost:8080, then:

1. Activate the **Elevation Theme** (Appearance > Themes)
2. Install and activate the required plugins (see below)
3. Enable **Public Introspection** in WP Admin > GraphQL > Settings
4. Create pages (Home, About, Services, Portfolio, Contact, Blog)
5. Set Reading > "A static page" with Home as front page and Blog as posts page
6. Set up a Primary navigation menu

---

## Required Plugins

These plugins must be installed and activated for the headless frontend to work.

### Core (required)

| Plugin | Install Method | Purpose |
|--------|---------------|---------|
| [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) | WP Admin > Plugins > Add New | GraphQL API — the backbone of the headless frontend |
| [WPGraphQL Gutenberg](https://github.com/pristas-peter/wp-graphql-gutenberg) | GitHub zip upload | Exposes `blocksJSON` field on all content types via GraphQL |

### SEO

| Plugin | Install Method | Purpose |
|--------|---------------|---------|
| [Rank Math SEO](https://wordpress.org/plugins/seo-by-rank-math/) | WP Admin > Plugins > Add New | SEO metadata, sitemaps, redirects |
| [WPGraphQL for Rank Math](https://github.com/developer-developer/developer-developer-developer) | GitHub zip upload | Exposes Rank Math SEO data via GraphQL `seo` field |

### Authentication (for preview/draft mode)

| Plugin | Install Method | Purpose |
|--------|---------------|---------|
| [WPGraphQL JWT Authentication](https://github.com/wp-graphql/wp-graphql-jwt-authentication) | GitHub zip upload | JWT tokens for authenticated GraphQL requests (preview mode) |

### WPGraphQL Settings

After installing WPGraphQL, go to **WP Admin > GraphQL > Settings** and enable:

- **Public Introspection** — required for codegen and IDE tooling
- **Show GraphQL Debug Messages** — helpful during development

### WPGraphQL Gutenberg Setup

After activating:

1. Visit **WP Admin > GraphQL > Gutenberg** to trigger the block registry sync
2. This registers all available Gutenberg block types with the GraphQL schema
3. The `blocksJSON` field will now appear on Page, Post, and all content types

### Rank Math Setup

After activating:

1. Complete the **Rank Math Setup Wizard** (WP Admin > Rank Math > Dashboard)
2. This is required — skipping it causes internal server errors on the `seo` GraphQL field
3. Basic settings are fine for the speedtest demo

---

## wp-config.php Constants

### Required for preview mode

```php
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-jwt-secret-here');
```

Set via WP-CLI:

```bash
docker-compose exec wpcli wp config set GRAPHQL_JWT_AUTH_SECRET_KEY "$(openssl rand -base64 64)" --type=constant --url="http://localhost:8080"
```

### Required for headless revalidation and preview links

```php
define('HEADLESS_URL', 'http://localhost:3000');
define('HEADLESS_SECRET', 'your-headless-secret');
```

Set via WP-CLI:

```bash
docker-compose exec wpcli wp config set HEADLESS_URL "http://localhost:3000" --type=constant --url="http://localhost:8080"
docker-compose exec wpcli wp config set HEADLESS_SECRET "speedtest-dev-secret" --type=constant --url="http://localhost:8080"
```

| Constant | Purpose |
|----------|---------|
| `GRAPHQL_JWT_AUTH_SECRET_KEY` | JWT signing for preview mode authentication |
| `HEADLESS_URL` | Frontend URL — used for preview links and ISR revalidation triggers |
| `HEADLESS_SECRET` | Shared secret — WordPress sends this when triggering revalidation on the frontend |

### What does NOT go in wp-config.php

| Variable | Where it lives | Notes |
|---|---|---|
| `WP_USER` / `WP_APP_PASS` | Next.js `.env.local` | Created via WP Admin UI (Application Passwords) |
| `NEXT_PUBLIC_WORDPRESS_API_URL` | Next.js `.env.local` | Frontend env var, not WordPress |

---

## Application Password Setup (optional)

The headless Next.js fetch script can authenticate against the WP REST API. The template structure endpoint is public, so this is optional.

1. **WP Admin > Users > Add New User**
2. Username: `frontendUser`, Role: Subscriber
3. Click the user > scroll to **Application Passwords**
4. Name: `headless-frontend` > **Add New Application Password**
5. Copy into Next.js `.env.local` as `WP_APP_PASS`

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
> service name. You need to exec into a service first:
> `docker-compose exec wordpress bash` then `nano wp-config.php`

---

## Theme

The Elevation Theme is a custom block theme mounted into the container from `./theme/`. Changes to theme files are reflected immediately (no rebuild needed).

### Theme Features

| Feature | File |
|---------|------|
| Custom post types (team_member, testimonial, project) | `inc/Features/PostTypesFeature.php` |
| REST API endpoints for template structure | `inc/Features/RestFeature.php` |
| Custom GraphQL fields (templateSlug, isPostsPage, isFrontPage) | `inc/Features/GraphQLFeature.php` |
| Block templates (page, single, index, etc.) | `templates/*.html` |
| Template parts (header, footer) | `parts/*.html` |
| Block patterns (page content) | `patterns/*.php` |

### REST API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /wp-json/template-structure/v1/full` | All templates, parts, patterns (used by fetch script) |
| `GET /wp-json/template-structure/v1/templates/{slug}` | Single template (used by ISR) |
| `GET /wp-json/template-structure/v1/parts/{slug}` | Single template part (used by ISR) |
| `GET /wp-json/template-structure/v1/patterns/{slug}` | Single pattern (used by ISR) |

---

## Production Deployment

### Hetzner CX22 (headless backend)

WordPress runs on the same Hetzner CX22 as the headless Next.js frontend. GraphQL requests from Next.js to WordPress happen over localhost with zero network latency.

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
