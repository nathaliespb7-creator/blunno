import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Blunno – Pocket Reset for Study Stress',
    short_name: 'Blunno',
    description:
      'Free offline PWA for study stress. SOS breathing exercises, focus sounds, mindful planner, and mini breaks for students. No signup required.',
    start_url: '/app',
    display: 'standalone',
    display_override: ['fullscreen', 'standalone', 'minimal-ui'],
    background_color: '#120f25',
    theme_color: '#120f25',
    orientation: 'portrait',
    lang: 'en',
    dir: 'ltr',
    categories: ['health', 'education', 'productivity', 'lifestyle'],
    iarc_rating_id: 'e58c1748-6b3a-4c3e-b8e2-0a8a1c0a5d3e',
    screenshots: [
      {
        src: '/screenshots/welcome.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Welcome screen with mascot',
      },
      {
        src: '/screenshots/choose.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Choose your mood',
      },
      {
        src: '/screenshots/sos.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'SOS breathing exercise',
      },
      {
        src: '/screenshots/planner.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Daily mindful planner',
      },
      {
        src: '/screenshots/play.png',
        sizes: '1170x2532',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mini games for breaks',
      },
      {
        src: '/screenshots/relax.png',
        sizes: '1170x2532',
        type: 'image/png',
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
