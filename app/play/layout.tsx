import type { ReactNode } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/play',
  title: 'Play',
  description: 'Quick study breaks with mini games — reset your mind between sessions.',
});

export default function PlayLayout({ children }: { children: ReactNode }) {
  return children;
}
