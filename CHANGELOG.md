# Changelog

All notable changes to the Speed Test POC will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Updated comparison app with brand palette similar to `wonderjarcreative`.

### Fixed

- Removed WordPress theme javascript adding extra mobile-menu toggle button.

## [0.9.0] - 2026-03-03

Converted static CPT patterns to dynamic `core/query` blocks with block bindings, so content comes from WordPress CPT posts on both traditional and headless sides.

### Added

- `BlockBindingsFeature.php`: registered `elevation/post-meta` block bindings source — WordPress resolves CPT meta fields (position, bio, rating, location, etc.) at render time, with rating→stars conversion
- Explicit `register_graphql_field()` calls in `GraphQLFeature.php` for all CPT meta (Project: location, projectType, squareFootage, yearCompleted, photoUrl; TeamMember: position, bio, photoUrl, order; Testimonial: authorName, authorRole, rating, photoUrl)
- 3 sub-patterns with block bindings: `team-card.php`, `testimonial-card.php`, `project-card.php`
- 3 CPT GraphQL queries for headless: `TeamMembersQuery.ts`, `ProjectsQuery.ts`, `TestimonialsQuery.ts`
- CPT query dispatch in `renderQuery.tsx` — maps `postType` attribute to correct GraphQL query
- Block bindings resolver in headless — resolves `elevation/post-meta` bindings from GraphQL data
- Pattern resolution in post template context — `core/pattern` blocks inside `core/post-template` now render
- `core/post-content` block handler (dangerouslySetInnerHTML)
- Grid layout support for post templates (CSS grid from `columnCount` attribute)

### Changed

- `team-grid.php`, `testimonials.php`, `portfolio-preview.php`, `page-portfolio.php`: replaced hardcoded static HTML with `core/query` blocks iterating over CPT posts
- Cover block: auto-detects `is-dark` when overlay color + dimRatio >= 50 (was defaulting to `is-light`)
- Button component: passes `attributes` to `getBlockClasses()` so `is-style-outline` is preserved
- Paragraph rendering in renderQuery: strips outer `<p>` to avoid `<div><p>` nesting
- Post-featured-image: applies `aspectRatio` and `scale` (object-fit) from block attributes

### Fixed

- `<hundefined>` tag in SiteTitle and Heading when `level` attribute is undefined
- Nav links blue on desktop — added `color: inherit`
- Missing `is-layout-constrained` 24px gap rule (was only on `is-layout-flow`)
- Heading font sizes stripped by Tailwind preflight — restored browser defaults
- alignfull sections getting unwanted 24px top margin between alternating backgrounds
- Button hover turning orange due to global `a:hover` color override in generated-tokens.css
- Outline button showing filled background (wrong attributes passed to class builder)
- `.wp-block-button` wrapper showing background color bleed-through — set `background: transparent`
- Normal vs outline button height mismatch — changed from `border: none` to `border: 2px solid transparent`
- Flex layout gap: 0.5em → 24px to match WP core

## [0.8.0] - 2026-02-17

### Added

- Synced all visual enhancements from WP theme.css to headless wp-compat.css:
  - Layout gap resets (header→main, footer, stacked full-width sections)
  - Sticky header
  - Button hover lift (translateY + box-shadow) and active state
  - Nav underline animation (desktop only, with active state)
  - Post card hover effects (lift + shadow + image scale)
  - Image border-radius (8px)
  - Ken Burns animation on cover images (scale 1→1.12, 25s)
  - Form input styling (border, radius, focus ring)
  - Quote cite styling (em dash prefix, gray-500, normal style)
  - Dropdown nav polish (border, hover colors, disabled underline in submenu)
  - Focus-visible accessibility outline
  - Reduced motion media query
  - Responsive grid (tablet 2-col, mobile 1-col)
- `gray-300` color (#d1d5db) to theme.json palette and regenerated design tokens

### Fixed

- Details.module.css: replaced non-existent CSS variable names with correct WP token names
- TemplatePart.tsx: renders semantic `<header>`/`<footer>` tags from WP `tagName` attribute instead of always `<div>`
- Outline button hover now matches WP theme (primary bg / white text, was white bg / gray-900 text)
- Quote block: updated border width (4px) and padding to match WP theme

## [0.7.1] - 2026-02-17

### Fixed

- `.alignfull` breakout centering: replaced `left: 50%; transform: translateX(-50%)` with `margin-left: calc(50% - 50vw)` approach — the old technique miscalculated when the containing block was narrower than the viewport, pushing elements too far left

## [0.7.0] - 2026-02-17

### Changed

- Renamed `fetch-wp-template-structure` to `sync-templates` and converted to ESM
- Moved `sync-templates` from `apps/headless/scripts/` to root `scripts/`
- Wired `sync-templates` into `dev-headless` and `build` Makefile targets so template data stays current automatically
- Fixed dotenv resolution to load from headless `node_modules`

### Removed

- `wordpress/theme/package.json` and `wordpress/theme/scripts/sync-theme-version.js` (unused)

## [0.6.0] - 2026-02-15

### Changed

- Simplified env setup: consolidated per-environment `.env.{env}.local.example` files into single `.env.example` → `.env.local` pattern
- Updated env loading in `codegen.ts` and `sync-templates.mjs` to merge `.env` + `.env.local` (was break-on-first-match, which skipped shared defaults)
- Removed unused `@next/env` import from codegen
- Deploy target: Coolify on Hetzner (was Vercel)

### Removed

- `.env.development.local.example` and `.env.production.local.example` (replaced by single `.env.example`)
- `.env.example.old` (stale)

## [0.5.0] - 2026-02-10

### Fixed

- PHPCS lint errors across all PHP files
- Removed typed `array` property from Loader.php for PHP <7.4 compatibility
- Added explicit version string to Google Fonts enqueue (was `null`)
- Added phpcs:ignore comments for WPGraphQL camelCase model properties in GraphQLFeature.php
- Added phpcs:ignore for local `file_get_contents` in RestFeature.php
- Added missing `@package ElevationTheme` tag and blank line spacing to all 21 pattern files

## [0.4.0] - 2026-02-10

Made the traditional WordPress theme heavier and more realistic for the speed comparison demo.

### Added

- jQuery-based theme JS (`assets/js/elevation-theme.js`) with:
  - Animated counter (easeOutQuart on `.elevation-counter` elements)
  - Smooth scroll for anchor links
  - Back-to-top button (appears on scroll)
  - Scroll reveal fade-in animations (using scroll events, not IntersectionObserver)
  - Mobile hamburger menu toggle
  - Header scroll shadow effect
  - Dropdown menu hover/keyboard handling (slideDown/slideUp)
  - Testimonial card pulse animation
  - Image lightbox overlay
- CSS for all new JS features: back-to-top button, lightbox overlay, dropdown menus, dropdown arrow indicators, mobile menu toggle with animated hamburger, testimonial pulse keyframes
- Render-blocking Google Fonts enqueue (Inter + Playfair Display)
- jQuery enqueue (render-blocking in `<head>`)

### Changed

- Header pattern: expanded from flat navigation to rich submenu structure
  - About > Our Story, Our Team, Awards & Recognition
  - Services > Residential Design, Commercial Interiors, Renovation & Remodeling, Consultation
  - Portfolio > All Projects, Residential, Commercial, Hospitality
- Stats counter pattern: changed static numbers to `<span>` elements with `data-target` and `data-suffix` attributes for JS counter animation

## [0.3.0] - 2026-02-10

Added custom post types, archive/single templates, and seed content for a realistic WordPress site.

### Added

- 3 custom post types in `PostTypesFeature.php`:
  - `project` with meta: location, project_type, square_footage, year_completed, photo_url
  - `team_member` with meta: position, bio, photo_url, order
  - `testimonial` with meta: author_name, author_role, rating, photo_url
- All CPTs registered with `show_in_graphql` and `show_in_rest` for headless compatibility
- `GraphQLFeature.php` for WPGraphQL resolver customization (featured images, raw content)
- `RestFeature.php` with `/template-structure/v1/full` endpoint for frontend caching
- 5 new templates: archive-project, archive-team_member, archive-testimonial, single-project, single-team_member
- Seed content in `setup.sh`:
  - 5 blog posts (design trends, renovations, commercial vs residential, sustainability, consultation)
  - 5 team members with positions and bios
  - 5 testimonials with ratings
  - 8 projects matching portfolio patterns (Modern Loft, Tech Startup HQ, Mountain Retreat, etc.)
  - Primary navigation menu with parent-child items

### Changed

- Loader.php: added PostTypesFeature, GraphQLFeature, RestFeature to feature loader
- Loader.php: added `enqueue_scripts()` method for jQuery and theme JS
- All CPTs have `has_archive => true` for archive pages

## [0.2.0] - 2026-02-06

Beefed up block patterns to create realistic page weight for the speed comparison demo.

### Added

- 7 new component patterns: client-logos, stats-counter, team-grid, process-steps, about-preview, awards-recognition, map-banner
- Total images increased from ~10 to ~44 across all patterns
- Total pattern lines increased from ~800 to ~1,850

### Changed

- Hero: increased min-height to 80vh, added secondary tagline
- Services grid: added images to all 4 cards (was 3 text-only), added 4th service (Renovation & Remodeling), added "Learn More" links
- Testimonials: expanded from 2 to 3, added headshot images and star ratings
- CTA: changed from solid background to cover block with architecture image
- Portfolio preview: added description paragraphs to each project card
- Homepage: 8 sections (was 5) — hero, client-logos, services-grid, stats-counter, portfolio-preview, about-preview, testimonials, cta
- About page: cover block hero, second story image, team-grid and awards-recognition patterns
- Services page: 4th service section (Renovation & Remodeling), process-steps pattern
- Portfolio page: 8 project cards with descriptions (was 6 without)
- Contact page: cover block hero, office photo in sidebar, map-banner at bottom
- front-page.html template updated to match new homepage pattern order

## [0.1.0] - 2025-02-05

Initial working theme with block patterns, templates, and custom CSS.

### Added

- Block theme scaffolding (Elevation Design Theme) with FSE support
- 7 page templates: front-page, page, single, home, index, archive, 404
- 13 block patterns: hero, services-grid, portfolio-preview, testimonials, cta, footer, header, post-grid, post-card, page-about, page-contact, page-portfolio, page-services
- Template parts for header and footer
- Custom CSS: button hover effects, post card animations, nav underline, form styling, quote block, print styles, responsive grid
- Ken Burns animation on cover block images (scale 1 to 1.12, 25s)
- Sticky header via CSS
- Layout gap resets (header-to-main, footer, stacked full-width sections)
- Accessibility: focus-visible outlines, skip link, reduced motion support
- Docker Compose setup for local WordPress development
- WP-CLI setup script for automated WordPress install and content seeding
- Makefile orchestration for dev commands
- `.prettierignore` to protect block markup from auto-formatting

### Fixed

- Block validation errors caused by indented markup in templates and patterns (WP parser requires flush-left HTML)
- Missing `has-custom-border` class on image figures with border-radius
- Unencoded `&` in Unsplash URLs (now `&amp;`)
- Normalized colors to theme palette values
- Removed extra inline styles not present in block JSON attributes
- Full-width layout issues (contentSize, wideSize, alignfull breakout)
