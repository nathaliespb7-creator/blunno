import type { MetadataRoute } from 'next';

const BASE = 'https://blunno.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/app`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/choose`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/sos`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/relax`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/planner`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/play`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
