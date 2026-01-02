# Denver Headless Speed Test

Interactive split-screen demo comparing traditional WordPress vs headless architecture performance.

## Overview

| Site | Domain | Stack |
|------|--------|-------|
| Comparison UI | speedtest.denverheadless.com | Next.js |
| Traditional WP | slow.speedtest.denverheadless.com | WordPress on Lightsail |
| Headless Frontend | fast.speedtest.denverheadless.com | Next.js + WPGraphQL on Vercel |

**Demo Business:** Elevation Design Studio (architecture & interior design)

## Project Structure

```
speedtest/
├── README.md
├── PROJECT_BRIEF.md
├── CLAUDE.md
├── comparison/          # Split-screen comparison interface
├── headless/            # Next.js headless frontend
└── wordpress/           # WordPress setup notes & config
```

## Quick Start

```bash
# Comparison interface
cd comparison && pnpm install && pnpm dev

# Headless frontend
cd headless && pnpm install && pnpm dev
```

## Deployment

- **Comparison**: Vercel (auto-deploy from main)
- **Headless**: Vercel (auto-deploy from main)
- **WordPress**: AWS Lightsail nano instance ($5/mo)
