'use client';

import { cn } from '@/lib/utils';

type WelcomeCTAProps = {
  onClick: () => void;
  className?: string;
};

export function WelcomeCTA({ onClick, className }: WelcomeCTAProps) {
  return (
    <button type="button" onClick={onClick} className={cn('welcome-cta group', className)}>
      <span aria-hidden className="welcome-cta-border" />
      <span aria-hidden className="welcome-cta-inner-glow" />
      <span aria-hidden className="welcome-cta-shine" />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Start Now</span>
    </button>
  );
}
