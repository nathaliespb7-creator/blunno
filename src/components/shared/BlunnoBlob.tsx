'use client';

import { motion, useReducedMotion, type TargetAndTransition } from 'framer-motion';
import { useBlunnoStore, type BlunnoState, type BreathPhase } from '@/store/blunnoStore';
import { BLUNNO_MASCOT_PNG } from '@/lib/assets';
import { cn } from '@/lib/utils';

type BlunnoBlobProps = {
  className?: string;
};

const GLOW_BG =
  'radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-core-planner) 32%, transparent) 0%, color-mix(in srgb, var(--color-core-play) 22%, transparent) 45%, color-mix(in srgb, var(--color-core-sos) 14%, transparent) 100%)';

const IMG_FILTER =
  'drop-shadow(0 0 32px color-mix(in srgb, var(--color-core-planner) 40%, transparent)) drop-shadow(0 0 48px color-mix(in srgb, var(--color-core-play) 30%, transparent))';

export const BlunnoBlob = ({ className }: BlunnoBlobProps) => {
  const { currentState, breathPhase } = useBlunnoStore();
  const reduceMotion = useReducedMotion();

  const stateVariants: Record<BlunnoState, TargetAndTransition> = {
    idle: {
      scale: [1, 1.03, 1],
      y: [0, -5, 0],
      transition: {
        duration: reduceMotion ? 0 : 3,
        repeat: reduceMotion ? 0 : Infinity,
        ease: 'easeInOut',
      },
    },
    breathing: {
      scale: 1,
      transition: { duration: 0.2 },
    },
    success: {
      y: [0, -30, 0],
      scaleX: [1, 0.8, 1.1, 1],
      scaleY: [1, 1.2, 0.9, 1],
      transition: { duration: reduceMotion ? 0 : 0.6, ease: 'easeOut' },
    },
    panic: {
      x: [-2, 2, -2, 2, 0],
      transition: {
        duration: reduceMotion ? 0 : 0.1,
        repeat: reduceMotion ? 0 : Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const breathVariants: Record<BreathPhase, TargetAndTransition> = {
    inhale: { scale: 1.25, transition: { duration: reduceMotion ? 0 : 4, ease: 'easeInOut' } },
    hold: { scale: 1.25, transition: { duration: 0.1 } },
    exhale: { scale: 1, transition: { duration: reduceMotion ? 0 : 8, ease: 'easeInOut' } },
    none: { scale: 1 },
  };

  const currentMotion: TargetAndTransition =
    breathPhase !== 'none' ? breathVariants[breathPhase] : stateVariants[currentState];

  return (
    <div className={cn('relative flex select-none items-center justify-center p-4 sm:p-6', className)}>
      <motion.div
        className="pointer-events-none absolute rounded-full blur-3xl"
        animate={
          reduceMotion
            ? { opacity: 0.5, scale: 1 }
            : { opacity: [0.45, 0.78, 0.45], scale: [1, 1.06, 1] }
        }
        transition={{
          duration: reduceMotion ? 0 : 3.5,
          repeat: reduceMotion ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: 280,
          height: 280,
          background: GLOW_BG,
        }}
      />

      <motion.div
        animate={currentMotion}
        className="relative z-10 h-[min(88vw,350px)] w-[min(88vw,350px)] max-h-[350px] max-w-[350px] cursor-pointer sm:h-80 sm:w-80"
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.img
          src={BLUNNO_MASCOT_PNG}
          alt="Blunno"
          className="h-full w-full object-contain"
          draggable={false}
          decoding="async"
          fetchPriority="high"
          style={{
            filter: IMG_FILTER,
          }}
        />
      </motion.div>
    </div>
  );
};
