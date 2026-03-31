# ─── Stage 1: Dependencies ───────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ─── Stage 2: Build ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# These are set at build time via Coolify env vars
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_WORDPRESS_API_URL
ARG NEXT_PUBLIC_WORDPRESS_API_HOSTNAME
ARG HEADLESS_SECRET
ARG WP_USER
ARG WP_APP_PASS
ARG WP_THEME=elevation-theme
ARG TEMPLATE_PART_REVALIDATE=300

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_WORDPRESS_API_URL=$NEXT_PUBLIC_WORDPRESS_API_URL
ENV NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=$NEXT_PUBLIC_WORDPRESS_API_HOSTNAME
ENV HEADLESS_SECRET=$HEADLESS_SECRET
ENV WP_USER=$WP_USER
ENV WP_APP_PASS=$WP_APP_PASS
ENV WP_THEME=$WP_THEME
ENV TEMPLATE_PART_REVALIDATE=$TEMPLATE_PART_REVALIDATE

# GraphQL codegen + build (needs WordPress accessible at build time)
RUN npm run build

# ─── Stage 3: Production ────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# sharp for next/image optimization in standalone mode
RUN npm install --os=linux --cpu=x64 sharp@0.33.5 && \
    rm -rf /root/.npm

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
