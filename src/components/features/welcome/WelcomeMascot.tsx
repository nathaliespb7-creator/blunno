'use client';

import { WELCOME_MASCOT_PNG, WELCOME_MASCOT_WEBP } from '@/lib/assets';
import { cn } from '@/lib/utils';

type WelcomeMascotProps = {
  className?: string;
};

export function WelcomeMascot({ className }: WelcomeMascotProps) {
  return (
    <div className={cn('welcome-mascot-root', className)} aria-hidden>
      <div className="welcome-mascot-glow" />
      <div className="welcome-mascot-float">
        {/* WebP first for LCP; PNG fallback for older WebViews */}
        <picture>
          <source srcSet={WELCOME_MASCOT_WEBP} type="image/webp" />
          <img
            src={WELCOME_MASCOT_PNG}
            alt=""
            width={350}
            height={350}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-contain"
            draggable={false}
            style={{
              filter: 'drop-shadow(0 0 30px rgba(124, 90, 255, 0.8))',
            }}
          />
        </picture>
      </div>
    </div>
  );
}
