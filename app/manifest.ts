import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'blunno-app',
    name: 'Blunno – Pocket Reset for Study Stress',
    short_name: 'Blunno',
    description:
      'Free offline PWA for study stress. SOS breathing exercises, focus sounds, mindful planner, and mini breaks for students. No signup required.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    display_override: ['fullscreen', 'standalone', 'minimal-ui'],
    background_color: '#120f25',
    theme_color: '#120f25',
    orientation: 'portrait',
    lang: 'en',
    dir: 'ltr',
    categories: ['health', 'education', 'productivity', 'lifestyle'],
    screenshots: [
      {
        src: '/screenshots/welcome.jpg',
        sizes: '1172x2379',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Welcome screen with mascot',
      },
      {
        src: '/screenshots/choose.jpg',
        sizes: '1179x2407',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Choose your mood',
      },
      {
        src: '/screenshots/sos.jpg',
        sizes: '1179x2394',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'SOS breathing exercise',
      },
      {
        src: '/screenshots/planner.jpg',
        sizes: '1179x2379',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Daily mindful planner',
      },
      {
        src: '/screenshots/play.jpg',
        sizes: '1179x2379',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Mini games for breaks',
      },
      {
        src: '/screenshots/relax.jpg',
        sizes: '1179x2362',
        type: 'image/jpeg',
        form_factor: 'narrow',
        label: 'Relax with calming sounds',
      },
    ],
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
