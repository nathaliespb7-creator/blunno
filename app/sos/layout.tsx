import type { ReactNode } from 'react';

import { BLUNNO_MASCOT_WEBP } from '@/lib/assets';
import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/sos',
  title: 'SOS — Breathe with Blunno',
  absoluteTitle: 'SOS — Breathe with Blunno | Study Stress Relief',
  description:
    'Free 3-minute SOS breathing for exam panic and study stress. Guided or trace mode with Blunno.',
});

export default function SosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preload" as="image" href={BLUNNO_MASCOT_WEBP} type="image/webp" fetchPriority="high" />
      {children}
    </>
  );
}
