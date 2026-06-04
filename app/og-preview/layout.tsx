import type { ReactNode } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/og-preview',
  title: 'OG Preview',
  description: 'Internal Open Graph preview for Blunno.',
  noIndex: true,
});

export default function OgPreviewLayout({ children }: { children: ReactNode }) {
  return children;
}
