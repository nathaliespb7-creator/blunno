'use client';

import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { cn } from '@/lib/utils';

type GlassActionButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  borderColor?: string;
  borderGradient?: string;
  textColor?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export function GlassActionButton({
  children,
  onClick,
  href,
  borderColor = 'rgba(255,255,255,0.3)',
  borderGradient = 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)',
  textColor,
  className,
  type = 'button',
  disabled,
}: GlassActionButtonProps): ReactElement {
  const style = {
    '--v81-action-border': borderColor,
    '--v81-action-gradient': borderGradient,
    '--v81-action-text': textColor ?? borderColor,
  } as React.CSSProperties;

  const classes = cn('v81-glass-action-btn blunno-focus-visible', className);

  const inner = (
    <>
      <GlassCellDecor borderColor={borderColor} />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} style={style}>
      {inner}
    </button>
  );
}
