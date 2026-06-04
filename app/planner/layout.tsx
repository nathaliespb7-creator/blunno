import type { ReactNode } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/planner',
  title: 'Planner',
  description: 'Simple daily planner to organize study tasks and reduce overwhelm.',
});

export default function PlannerLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
