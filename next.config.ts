import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /** При нескольких lockfile Next иначе считает корень ~/ и ломает resolve tailwindcss. */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'howler'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
