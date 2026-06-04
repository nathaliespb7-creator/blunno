import type { ReactElement, ReactNode } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/relax',
  title: 'Relax',
  description: 'Focus sounds and ambience for studying — works offline, no signup.',
});

export default function RelaxLayout({ children }: { children: ReactNode }): ReactElement {
  return <>{children}</>;
}
