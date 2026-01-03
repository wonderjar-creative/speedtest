import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add your WordPress domains here
    domains: [
      'projectname.local',           // Local development
      'cms.example.com',             // Production WordPress
      'staging.cms.example.com',     // Staging WordPress
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
