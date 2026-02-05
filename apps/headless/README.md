# Project Frontend

Next.js 15 frontend for a headless WordPress site using WPGraphQL.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **CMS**: WordPress with WPGraphQL
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A running WordPress instance with WPGraphQL plugin

**Important**: The frontend cannot build without a live WordPress instance. GraphQL CodeGen fetches the schema at build time.

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.development.local
   # Edit .env.development.local with your values
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

This will:
- Fetch WordPress template structure
- Generate TypeScript types from GraphQL schema
- Start Next.js dev server at http://localhost:3000

## Commands

```bash
pnpm dev           # Fetch templates -> codegen -> next dev
pnpm build         # Production build (requires WordPress)
pnpm codegen       # Regenerate GraphQL types
pnpm fetch-wp-template-structure  # Update template/pattern cache
pnpm lint          # ESLint
pnpm clean         # Remove .next, data, node_modules, src/gql
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [[...slug]]/page.tsx      # Catch-all route handler
│   ├── api/
│   │   ├── preview/              # Draft mode handler
│   │   └── revalidate/           # ISR webhook endpoint
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/
│   ├── Blocks/Core/              # WordPress block components
│   ├── Globals/                  # Header, footer, etc.
│   └── Templates/                # Page, Post templates
│
├── queries/                      # GraphQL query definitions
├── utils/                        # Utility functions
├── types/                        # TypeScript interfaces
└── gql/                          # Auto-generated (gitignored)
```

## Adding New Blocks

1. Create component: `src/components/Blocks/Core/[BlockName]/[BlockName].tsx`
2. Add case in `getBlockComponents.tsx` switch statement
3. Import attribute types from `@/gql/graphql`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WORDPRESS_API_URL` | WordPress URL (no trailing slash) |
| `NEXT_PUBLIC_BASE_URL` | Frontend URL for canonical URLs |
| `HEADLESS_SECRET` | ISR revalidation secret |
| `WP_USER` | WordPress username for REST API |
| `WP_APP_PASS` | WordPress application password |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy! (auto-deploys on push to main)

### Environment Setup

- **Production**: Set `NEXT_PUBLIC_WORDPRESS_API_URL` to production WordPress
- **Preview**: Vercel preview deployments use the same env vars
- **Staging**: Create a separate Vercel project pointing to staging WordPress

## Caching Strategy

- **Pages**: 5-minute ISR (`revalidate = 300`)
- **Template parts**: 1-hour cache in `data/*.json`
- **On-demand**: `/api/revalidate` endpoint with secret key

## Troubleshooting

- **Build fails with GraphQL errors**: Check WordPress is accessible
- **Preview not working**: Verify JWT credentials in WordPress
- **Template parts missing**: Run `pnpm fetch-wp-template-structure`
- **Styles missing**: Ensure `theme.json` matches Tailwind config
