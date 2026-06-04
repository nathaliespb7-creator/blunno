import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /** При нескольких lockfile Next иначе считает корень ~/ и ломает resolve tailwindcss. */
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: { config: [__filename] },
      };
      config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://www.google-analytics.com",
          "font-src 'self' data:",
          "media-src 'self' data: blob:",
          "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    ];

    const noStoreHeaders = [
      { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
    ];

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/sw.js',
        headers: noStoreHeaders,
      },
      {
        source: '/precache-manifest.json',
        headers: noStoreHeaders,
      },
    ];
  },
};

export default nextConfig;
