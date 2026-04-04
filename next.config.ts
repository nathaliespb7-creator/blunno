import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'howler'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
