import type { MetadataRoute } from 'next';

const BASE = 'https://blunno.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const paths = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/app', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: '/breathing', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/focus', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/student', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/choose', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/sos', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/relax', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/planner', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/play', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: `${BASE}${path}`,
        ru: `${BASE}${path}`,
      },
    },
  }));
}
