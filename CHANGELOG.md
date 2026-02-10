# Changelog

All notable changes to the Speed Test POC will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
