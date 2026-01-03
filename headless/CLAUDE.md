# CLAUDE.md - Headless Frontend

Optimized Next.js frontend for **Elevation Design Studio** demo. Part of the Denver Headless Speed Test POC.

**Purpose:** The "fast" side of the speed comparison demonstrating headless architecture benefits.
- **Target:** Lighthouse 95-100, LCP < 1s
- **Deploy:** Vercel at `fast.speedtest.denverheadless.com`

## Commands

```bash
pnpm dev              # Fetch templates -> codegen -> next dev
pnpm build            # Production build (requires WordPress)
pnpm codegen          # Regenerate GraphQL types
pnpm fetch-wp-template-structure  # Update template/pattern cache
pnpm lint             # ESLint
pnpm clean            # Remove .next, data, node_modules, src/gql
```

## Key Files

| Path | Purpose |
|------|---------|
| `src/app/[[...slug]]/page.tsx` | Catch-all route handler |
| `src/utils/getBlockComponents.tsx` | Block-to-component mapper |
| `src/utils/blockStyles.ts` | WordPress attrs -> Tailwind classes |
| `src/utils/blockMedia.ts` | Media enrichment via REST API |
| `src/utils/fetchGraphQL.ts` | GraphQL client with auth |
| `src/components/Blocks/Core/` | Block component implementations |
| `src/components/Templates/` | Page/Post templates |
| `src/queries/` | GraphQL query definitions |
| `middleware.ts` | Redirect handling |
| `data/*.json` | Cached template parts/patterns |

## Architecture

### Block System
WordPress blocks -> React components:
- Each receives `{ name, attributes, saveContent, innerBlocks }`
- `core/template-part` and `core/pattern` resolve dynamically
- `blockMedia.ts` batch-fetches media details

### Adding New Blocks
1. Create component: `src/components/Blocks/Core/[BlockName]/[BlockName].tsx`
2. Add case in `getBlockComponents.tsx` switch statement with `dynamic()` import
3. Import attribute types from `@/gql/graphql`
4. Use `getBlockClasses()` and `getBlockBaseClass()` from `blockStyles.ts`

### Component Conventions
- **Use arrow functions**: All components use `const Component: React.FC<Props> = () => {}` syntax
- **No index.ts files**: Import components directly
- **Strip outer tags**: Use `stripOuterTag()` when WordPress saveContent includes wrapper tags
- **Type interfaces**: Define component-specific interfaces inline

### GraphQL
- Types generated in `src/gql/` (gitignored)
- Run `npm run codegen` after schema changes
- Queries in `src/queries/`

### Preview/Draft Mode
- WordPress preview -> `/api/preview` -> JWT auth -> Next.js `draftMode()`

## Environment Variables

Required in `.env.development.local`:
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://slow.speedtest.denverheadless.com
HEADLESS_SECRET=xxx                  # ISR revalidation
WP_USER=username                     # WordPress app password user
WP_APP_PASS=xxxx xxxx xxxx xxxx      # WordPress app password
```

## Demo Pages: Elevation Design Studio

| Page | Path | Key Blocks |
|------|------|------------|
| Homepage | `/` | Hero, Services Grid, Portfolio Preview, Testimonials |
| About | `/about` | Company Story, Team Grid, Values |
| Services | `/services` | Service Cards (4) |
| Portfolio | `/portfolio` | Project Grid with filtering |
| Project Detail | `/portfolio/[slug]` | Gallery, Project Info |
| Contact | `/contact` | Form, Map, Office Info |

## Troubleshooting

- **Build fails with GraphQL errors**: Check WordPress is accessible
- **Preview not working**: Verify JWT credentials
- **Template parts missing**: Run `pnpm fetch-wp-template-structure`
- **Styles missing**: Ensure `theme.json` matches Tailwind config
