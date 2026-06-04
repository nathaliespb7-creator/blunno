import type { ReactNode } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/choose',
  title: 'Choose your mood',
  description:
    'Pick your study reset: SOS breathing for exam panic, planner, mini games, or focus sounds.',
});

export default function ChooseLayout({ children }: { children: ReactNode }) {
  return children;
}
