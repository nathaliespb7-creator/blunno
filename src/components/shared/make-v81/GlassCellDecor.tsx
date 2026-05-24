'use client';

import type { CSSProperties, ReactElement } from 'react';

import { cn } from '@/lib/utils';

type GlassCellDecorProps = {
  borderColor?: string;
  className?: string;
};

export function GlassCellDecor({ borderColor, className }: GlassCellDecorProps): ReactElement {
  const style = borderColor
    ? ({ '--v81-cell-border': borderColor } as CSSProperties)
    : undefined;

  return (
    <>
      <span aria-hidden className={cn('v81-cell-border', className)} style={style} />
      <span aria-hidden className={cn('v81-cell-inner-glow', className)} style={style} />
      <span aria-hidden className="v81-cell-shine" />
    </>
  );
}
