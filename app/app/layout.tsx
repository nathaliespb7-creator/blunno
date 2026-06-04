import type { ReactNode } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/app',
  title: 'Welcome',
  description:
    'Open Blunno — free offline PWA for study stress. SOS breathing, focus sounds, planner, and mini breaks.',
});

export default function AppWelcomeLayout({ children }: { children: ReactNode }) {
  return children;
}
