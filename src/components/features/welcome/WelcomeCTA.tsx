'use client';

import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { cn } from '@/lib/utils';

type WelcomeCTAProps = {
  href: string;
  onNavigate?: () => void;
  className?: string;
};

export function WelcomeCTA({ href, onNavigate, className }: WelcomeCTAProps) {
  return (
    <a href={href} onClick={onNavigate} className={cn('welcome-cta group', className)}>
      <GlassCellDecor />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Start Now</span>
    </a>
  );
}
