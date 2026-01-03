# CLAUDE.md - Elevation Design Theme

FSE block theme for **Elevation Design Studio** demo. Part of the Denver Headless Speed Test POC.

**Purpose:** Provides content structure, blocks, and GraphQL schema for both:
- Traditional WP frontend (`slow.speedtest.denverheadless.com`)
- Headless Next.js frontend (`fast.speedtest.denverheadless.com`)

## Commands

```bash
npm run dev           # Install deps, autoload, fix linting
npm run build         # Install deps, autoload, lint check
npm run lint:php      # PHP CodeSniffer check
npm run lint:php:fix  # Auto-fix PHP linting issues

# Versioning
npm run version:patch # Bump patch version (1.0.x)
npm run version:minor # Bump minor version (1.x.0)
npm run version:major # Bump major version (x.0.0)

npm run zip:theme     # Build production zip for deployment
```

## Structure

```
inc/
├── Theme.php         # Main theme class
├── Loader.php        # Dependency loader
└── Features/         # Feature modules (REST endpoints, etc.)

parts/                # Template parts (header, footer, etc.)
patterns/             # Block patterns
templates/            # Full page templates

theme.json            # Colors, spacing, typography (synced with Tailwind)
functions.php         # Theme bootstrap
style.css             # Theme metadata
```

## Key Concepts

### Theme Architecture
Class-based: `Theme.php` → `Loader.php` → Feature modules in `inc/Features/`

### REST Endpoints
- `/wp-json/template-structure/v1/full` - Template data for frontend caching

### theme.json Sync
Colors and spacing in `theme.json` must match Tailwind config in frontend repo.

## Required Plugins

- WPGraphQL
- WPGraphQL JWT Authentication
- WPGraphQL for Rank Math
- Rank Math SEO
- Gravity Forms

## Demo Content: Elevation Design Studio

| Page | Content |
|------|---------|
| Homepage | Hero, Services Grid, Portfolio Preview, Testimonials, CTA |
| About | Company Story, Team Members, Values |
| Services | Residential, Commercial, Renovation, Consultation |
| Portfolio | Project Grid (6-8 projects) |
| Contact | Form, Office Info, Map |

**Custom Post Type:** Projects (portfolio items)

## Deployment

1. Run `npm run zip:theme` to create production zip
2. Upload to WordPress via admin or SFTP
3. Activate theme
4. Install required plugins
5. Import demo content
