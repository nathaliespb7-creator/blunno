'use client';

import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ScreenFrameProps = {
  children: ReactNode;
  className?: string;
  glowVariant?: 'default' | 'relax' | 'game';
};

export function ScreenFrame({ children, className, glowVariant = 'default' }: ScreenFrameProps): ReactElement {
  return (
    <main className={cn('v81-screen', glowVariant === 'relax' && 'v81-screen--relax', className)}>
      <div className="v81-ambient-glow-a" aria-hidden />
      <div className="v81-ambient-glow-b" aria-hidden />
      {glowVariant === 'relax' && <div className="v81-ambient-glow-c" aria-hidden />}
      <div className="v81-screen-inner">{children}</div>
    </main>
  );
}
