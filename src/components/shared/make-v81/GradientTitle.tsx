'use client';

import type { ReactElement, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type GradientTitleProps = {
  children: ReactNode;
  as?: 'h1' | 'h2';
  size?: 'lg' | 'md' | 'sm';
  className?: string;
};

export function GradientTitle({ children, as: Tag = 'h1', size = 'lg', className }: GradientTitleProps): ReactElement {
  return (
    <Tag
      className={cn(
        'v81-gradient-title',
        size === 'lg' && 'v81-gradient-title--lg',
        size === 'md' && 'v81-gradient-title--md',
        size === 'sm' && 'v81-gradient-title--sm',
        className
      )}
    >
      {children}
    </Tag>
  );
}
