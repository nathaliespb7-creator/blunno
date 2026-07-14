import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: 'blunno-app',
    name: 'Blunno — карманный ресет для учебного стресса',
    short_name: 'Blunno',
    description:
      'Бесплатное офлайн-приложение для студентов: дыхательные упражнения SOS, звуки для фокуса, ежедневник и мини-игры. Без регистрации.',
    start_url: '/app',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'fullscreen', 'minimal-ui'],
    background_color: '#120f25',
    theme_color: '#120f25',
    orientation: 'portrait',
    lang: 'ru',
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
