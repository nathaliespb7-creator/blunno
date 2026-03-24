'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { useEffect } from 'react';
import { useBlunnoStore } from '@/store/blunnoStore';
import { audioService } from '@/services/audioService';
import type { BlunnoState } from '@/store/blunnoStore';

// Цвет свечения под каждое состояние
const glowColor: Record<BlunnoState, string> = {
  idle:       'rgba(129, 140, 248, 0.45)',
  breathing:  'rgba(56,  189, 248, 0.55)',
  sos_active: 'rgba(239, 68,  68,  0.65)',
  success:    'rgba(250, 204, 21,  0.70)',
};

const wrapperVariants: Variants = {
  idle: {
    scale: [1, 1.03, 1],
    rotate: [0, 0.8, -0.8, 0],
    y: [0, -4, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  breathing: {
    scale: [1, 1.13, 1],
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
  sos_active: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatType: 'loop', ease: 'linear' },
  },
  success: {
    scale: [1, 1.25, 0.95, 1.05, 1],
    rotate: [0, -5, 5, -3, 0],
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const BlunnoBlobPNG = () => {
  const { state, setState } = useBlunnoStore();

  useEffect(() => {
    if (state === 'success') {
      audioService.play('success');
      const t = setTimeout(() => setState('idle'), 1200);
      return () => clearTimeout(t);
    }
    if (state === 'sos_active') {
      audioService.play('sos');
    }
  }, [state, setState]);

  const handleTap = () => {
    audioService.unlock();
    audioService.play('bubble');
  };

  return (
    <div className="relative flex items-center justify-center select-none">

      {/* Большое фоновое свечение — меняет цвет по состоянию */}
      <motion.div
        animate={{
          opacity: [0.5, 0.85, 0.5],
          backgroundColor: glowColor[state],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 rounded-full blur-[90px]"
      />

      {/* Среднее свечение под персонажем */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 w-40 h-10 rounded-[100%] blur-2xl"
        style={{ background: glowColor[state] }}
      />

      {/* Сам персонаж — PNG с анимацией */}
      <motion.div
        variants={wrapperVariants}
        animate={state}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        onTap={handleTap}
        className="relative cursor-pointer"
        style={{ filter: `drop-shadow(0 0 24px ${glowColor[state]})` }}
      >
        <Image
          src="/blunno.png"
          alt="Blunno"
          width={220}
          height={260}
          priority
          draggable={false}
        />

        {/* Мигание глаз поверх PNG при state === 'sos_active' */}
        {state === 'sos_active' && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.15) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Золотой флэш при success */}
        {state === 'success' && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(250,204,21,0.5) 0%, transparent 70%)',
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
