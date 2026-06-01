import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Blunno',
    short_name: 'Blunno',
    description: 'Your gentle companion for anxiety and ADHD',
    start_url: '/',
    display: 'standalone',
    display_override: ['fullscreen', 'standalone', 'minimal-ui'],
    background_color: '#120f25',
    theme_color: '#120f25',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
