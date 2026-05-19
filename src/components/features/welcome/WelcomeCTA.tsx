'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

type WelcomeCTAProps = {
  onClick: () => void;
  className?: string;
};

export function WelcomeCTA({ onClick, className }: WelcomeCTAProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className={cn('welcome-cta group', className)}
    >
      <span aria-hidden className="welcome-cta-border" />
      <span aria-hidden className="welcome-cta-inner-glow" />
      {!reduceMotion ? <span aria-hidden className="welcome-cta-shine" /> : null}
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Start Now</span>
    </motion.button>
  );
}
