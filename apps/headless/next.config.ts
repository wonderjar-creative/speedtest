import type { NextConfig } from "next";
import withBundleAnalyzerImport from '@next/bundle-analyzer';

// Webpack-only plugin: enable with ANALYZE=true via `npm run build:analyze`.
// Next 16's `next build` defaults to Turbopack; analyzer needs --webpack.
const withBundleAnalyzer = withBundleAnalyzerImport({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.denverheadless.com',
      },
    ],
    // Next.js 16 silently ignores unlisted quality values and falls back to
    // the default (75). 60 is what Cover/Image/PostFeaturedImage pass for
    // priority-flagged LCP candidates (overlay hides any artifacts).
    qualities: [60, 75],
    // Default smallest deviceSize is 640. Lighthouse mobile (360px @ DPR 2)
    // would download the 750w variant. Adding 384/480 lets the cover's
    // sizes attribute nudge the browser toward smaller mobile variants.
    deviceSizes: [384, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  output: 'standalone',
};

export default withBundleAnalyzer(nextConfig);
