# Project Theme

A headless WordPress block theme for use with Next.js frontend and WPGraphQL.

## Prerequisites

- WordPress 6.0+
- PHP 8.1+
- Composer

## Required Plugins

Install and activate these plugins:

- **WPGraphQL** - GraphQL API for WordPress
- **WPGraphQL JWT Authentication** - JWT auth for preview mode
- **WPGraphQL for Rank Math** - SEO data in GraphQL (optional)
- **Rank Math SEO** - SEO management (optional)
- **Gravity Forms** - Forms (optional)

## Setup

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Install theme:**
   - Upload to `wp-content/themes/`
   - Or create a zip: `npm run zip:theme`

3. **Activate theme** in WordPress admin

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

# Deployment (requires ops repo)
npm run deploy:staging
npm run deploy:production
```

## Structure

```
project-theme/
├── inc/
│   ├── Theme.php           # Main theme class
│   ├── Loader.php          # Dependency loader
│   └── Features/           # Feature modules
│       ├── GraphQLFeature.php
│       └── RestFeature.php
│
├── parts/                  # Template parts
│   ├── header.html
│   └── footer.html
│
├── patterns/               # Block patterns
│   └── example.php
│
├── templates/              # Full page templates
│   ├── index.html
│   └── page.html
│
├── theme.json              # Design tokens (colors, spacing, typography)
├── functions.php           # Theme bootstrap
├── style.css               # Theme metadata
└── composer.json           # PHP dependencies
```

## theme.json Sync

Colors and spacing in `theme.json` must match your Tailwind config in the frontend repo.

When updating colors:
1. Edit `theme.json` color palette
2. Update frontend `globals.css` with matching values
3. Test both admin editor and frontend

## Adding Patterns

1. Create file in `patterns/` directory:
   ```php
   <?php
   /**
    * Title: Pattern Name
    * Slug: project-theme/pattern-name
    * Categories: featured
    */
   ?>
   <!-- wp:group -->
   <div class="wp-block-group">
     <!-- Your pattern content -->
   </div>
   <!-- /wp:group -->
   ```

2. Pattern will be available in WordPress block editor

## Deployment

1. Build production zip:
   ```bash
   npm run zip:theme
   ```

2. Upload to WordPress:
   - Via admin: Appearance → Themes → Add New → Upload
   - Via SFTP: Upload to `wp-content/themes/`
   - Via ops scripts: `npm run deploy:production`
