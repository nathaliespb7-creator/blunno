import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Relax - Blunno',
  description: 'Focus sounds and ambience for studying — works offline, no signup.',
};

export default function RelaxLayout({ children }: { children: React.ReactNode }): ReactElement {
  return <>{children}</>;
}
