import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Planner - Blunno',
  description: 'Gentle daily planner for ADHD',
};

export default function PlannerLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
