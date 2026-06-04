import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/offline', '/og-preview'],
    },
    sitemap: 'https://blunno.app/sitemap.xml',
  };
}
