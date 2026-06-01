import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Planner - Blunno',
  description: 'Simple daily planner to organize study tasks and reduce overwhelm.',
};

export default function PlannerLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
