import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Relax - Blunno',
  description: 'Relaxation exercises and peaceful activities',
};

export default function RelaxLayout({ children }: { children: React.ReactNode }): ReactElement {
  return <>{children}</>;
}
