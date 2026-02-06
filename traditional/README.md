# Traditional WordPress Setup

This directory documents the "slow" traditional WordPress installation used for comparison.

**This is NOT deployed from this repo.** It's a stock WordPress install on cheap shared hosting.

## Setup

| Setting | Value |
|---------|-------|
| **Host** | Cheap shared hosting (Namecheap, Bluehost, etc.) |
| **URL** | slow.speedtest.denverheadless.com |
| **WordPress** | Latest stable (one-click install) |

## Theme

Using a popular free theme, NOT optimized:
- **Astra** or **GeneratePress** or **Kadence**
- Default settings, no speed optimization

## Plugins

Typical small business plugin stack (all free, no paid licenses):
- Rank Math SEO (free tier)
- Contact Form 7
- Smart Slider 3 (free version)
- WP Super Cache (basic caching, not aggressive)

## Content

Same content as the headless site:
- Homepage with hero, services, testimonials
- About page
- Services page
- Blog posts
- Contact page with form

Content is manually duplicated or imported via WordPress export/import.

## Performance Notes

This site is intentionally NOT optimized. The goal is to represent a typical small business WordPress site:
- No aggressive caching
- No CDN
- No image optimization plugins
- No minification beyond what the theme provides
- Shared hosting with other sites on the same server

Expected Lighthouse score: 45-55
