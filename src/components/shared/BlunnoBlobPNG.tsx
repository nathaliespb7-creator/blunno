'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect } from 'react';
import { useBlunnoStore, type BlunnoState } from '@/store/blunnoStore';
import { audioService } from '@/services/audioService';
import { BLUNNO_MASCOT_PNG } from '@/lib/assets';

const FILTER_PLANNER = 'drop-shadow(0 0 12px color-mix(in srgb, var(--color-core-planner) 55%, transparent))';
const FILTER_PLAY = 'drop-shadow(0 0 20px color-mix(in srgb, var(--color-core-play) 50%, transparent))';
const FILTER_RELAX = 'drop-shadow(0 0 28px color-mix(in srgb, var(--color-core-relax) 55%, transparent))';
const FILTER_SOS = 'drop-shadow(0 0 24px color-mix(in srgb, var(--color-core-sos) 50%, transparent))';

export const BlunnoBlobPNG = () => {
  const { currentState } = useBlunnoStore();
  const reduceMotion = useReducedMotion();

  const variants: Variants = {
    idle: {
      scale: [1, 1.02, 1],
      rotate: [0, 1, -1, 0],
      filter: [FILTER_PLANNER, FILTER_PLAY, FILTER_PLANNER],
      transition: { duration: reduceMotion ? 0 : 3, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' },
    },
    breathing: {
      scale: [1, 1.15, 1],
      rotate: [0, 0, 0, 0],
      filter: FILTER_PLANNER,
      transition: { duration: reduceMotion ? 0 : 4, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' },
    },
    success: {
      scale: [1, 1.3, 1],
      filter: FILTER_RELAX,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' },
    },
    panic: {
      x: [0, -4, 4, -2, 2, 0],
      rotate: [0, -2, 2, -1, 1, 0],
      filter: FILTER_SOS,
      transition: {
        duration: reduceMotion ? 0 : 0.12,
        repeat: reduceMotion ? 0 : Infinity,
      },
    },
  };

  useEffect(() => {
    if (currentState === 'success') {
      audioService.play('success');
    }
  }, [currentState]);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={
          reduceMotion
            ? { scale: 1, opacity: 0.65 }
            : {
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.9, 0.6],
              }
        }
        transition={{ duration: reduceMotion ? 0 : 3, repeat: reduceMotion ? 0 : Infinity }}
        className="absolute h-56 w-56 rounded-full blur-3xl"
        style={{
          background:
            'color-mix(in srgb, var(--color-core-play) 22%, var(--color-core-bg) 78%)',
        }}
      />
      <motion.img
        src={BLUNNO_MASCOT_PNG}
        alt="Blunno"
        width={192}
        height={192}
        variants={variants}
        animate={currentState as BlunnoState}
        whileHover={reduceMotion ? undefined : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className="relative h-48 w-48 object-contain"
      />
    </div>
  );
};
