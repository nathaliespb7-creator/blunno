'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

const CYCLE_S = 4;

const PULSE_SHADOW = [
  '0 10px 40px -10px rgba(124,90,255,0.45), inset 0 0 16px rgba(124,90,255,0.12)',
  '0 12px 56px -4px rgba(153,130,255,0.95), inset 0 0 40px rgba(153,130,255,0.5)',
  '0 10px 40px -10px rgba(124,90,255,0.45), inset 0 0 16px rgba(124,90,255,0.12)',
] as const;

type WelcomeCTAProps = {
  onClick: () => void;
  className?: string;
};

export function WelcomeCTA({ onClick, className }: WelcomeCTAProps) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ boxShadow: animate ? [...PULSE_SHADOW] : PULSE_SHADOW[0] }}
      transition={{
        boxShadow: {
          duration: animate ? CYCLE_S : 0,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
        },
      }}
      whileHover={animate ? { scale: 1.02 } : undefined}
      whileTap={animate ? { scale: 0.98 } : undefined}
      className={cn(
        'group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full',
        'text-[17px] font-semibold tracking-wide text-white',
        className
      )}
      style={{
        background: 'rgba(18, 12, 48, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full border-[1.5px] border-[#8B6BFF]"
        initial={false}
        animate={animate ? { opacity: [0.65, 1, 0.65] } : { opacity: 0.8 }}
        transition={{
          duration: animate ? CYCLE_S : 0,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      <div
        className="absolute inset-0 rounded-full opacity-50 mix-blend-screen shadow-[inset_0_0_12px_#8B6BFF] transition-opacity group-hover:opacity-70"
        aria-hidden
      />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Start Now</span>
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-0 z-0 w-full skew-x-[-30deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={false}
        animate={animate ? { x: ['-150%', '250%'] } : { x: '-150%' }}
        transition={
          animate
            ? { duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }
            : { duration: 0 }
        }
      />
    </motion.button>
  );
}
