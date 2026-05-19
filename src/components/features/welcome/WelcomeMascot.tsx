'use client';

import Image from 'next/image';

import { WELCOME_MASCOT_PNG } from '@/lib/assets';
import { cn } from '@/lib/utils';

type WelcomeMascotProps = {
  className?: string;
};

export function WelcomeMascot({ className }: WelcomeMascotProps) {
  return (
    <div className={cn('welcome-mascot-root', className)} aria-hidden>
      <div className="welcome-mascot-glow" />
      <div className="welcome-mascot-float">
        <Image
          src={WELCOME_MASCOT_PNG}
          alt=""
          width={350}
          height={350}
          priority
          className="h-full w-full object-contain"
          draggable={false}
          sizes="(max-width: 640px) 88vw, 350px"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(124, 90, 255, 0.8))',
          }}
        />
      </div>
    </div>
  );
}
