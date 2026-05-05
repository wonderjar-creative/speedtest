import type { NextConfig } from "next";

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
  },
  output: 'standalone',
};

export default nextConfig;
