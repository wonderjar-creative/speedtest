# Changelog

All notable changes to the Speed Test POC will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
