# CLAUDE.md - Headless Frontend

Optimized Next.js frontend for **Elevation Design Studio** demo. Part of the Denver Headless Speed Test POC.

**Purpose:** The "fast" side of the speed comparison demonstrating headless architecture benefits.
- **Target:** Lighthouse 95-100, LCP < 1s
- **Deploy:** Coolify on Hetzner at `fast.speedtest.denverheadless.com`

## Architecture

Uses **explicit routes with page-specific components** (not a block renderer). Each page is a server component that fetches its own data and renders hardcoded section components. Only 2 client components: `StatsCounter` (IntersectionObserver animation) and `ContactForm` (form state).

## Commands

```bash
npm run dev       # Next.js dev server
npm run build     # Production build (standalone output)
npm run start     # Start production server
npm run lint      # ESLint
```

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage |
| `src/app/about/page.tsx` | About page |
| `src/app/services/page.tsx` | Services page |
| `src/app/portfolio/page.tsx` | Portfolio listing |
| `src/app/portfolio/[slug]/page.tsx` | Single project |
| `src/app/blog/page.tsx` | Blog listing |
| `src/app/blog/[slug]/page.tsx` | Single post |
| `src/app/contact/page.tsx` | Contact page |
| `src/components/sections/` | 22 section components |
| `src/components/ui/` | Button, SectionWrapper |
| `src/components/layout/` | Header, Footer |
| `src/lib/queries/` | GraphQL queries |
| `src/lib/types.ts` | TypeScript types |
| `src/lib/fonts.ts` | Self-hosted fonts (Inter, Playfair Display) |
| `src/utils/fetchGraphQL.ts` | GraphQL client with draft mode |
| `src/app/api/preview/route.ts` | WordPress preview handler |
| `src/app/api/revalidate/route.ts` | ISR revalidation webhook |

## Environment Variables

Required in `.env.development.local`:
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://slow.speedtest.denverheadless.com
HEADLESS_SECRET=xxx                  # ISR revalidation
```

## Design Tokens

Colors, fonts, and spacing are synced from WordPress `theme.json` into `globals.css`:
- Primary: `#0ea5e9` (sky blue)
- Accent: `#f97316` (orange)
- Fonts: Inter (body), Playfair Display (headings)
