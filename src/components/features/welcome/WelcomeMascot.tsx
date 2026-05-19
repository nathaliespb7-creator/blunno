'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

import { WELCOME_MASCOT_PNG } from '@/lib/assets';
import { cn } from '@/lib/utils';

const CYCLE_S = 4;

type WelcomeMascotProps = {
  className?: string;
};

export function WelcomeMascot({ className }: WelcomeMascotProps) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <motion.div
      initial={false}
      animate={animate ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 1 }}
      transition={{ duration: animate ? 1 : 0, ease: 'easeOut' }}
      className={cn(
        'relative mx-auto aspect-square w-[min(88vw,350px,calc(100dvh-448px))] max-w-[350px]',
        className
      )}
      aria-hidden
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
        initial={false}
        animate={
          animate
            ? { scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }
            : { scale: 1, opacity: 0.75 }
        }
        transition={{
          duration: animate ? CYCLE_S : 0,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
        }}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(124, 90, 255, 0.6) 0%, rgba(93, 63, 224, 0.2) 50%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />

      <div
        className="pointer-events-none absolute inset-16 rounded-full mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(164, 147, 255, 0.5) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={animate ? { y: [-8, 8, -8] } : { y: 0 }}
        transition={{
          duration: animate ? CYCLE_S : 0,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
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
      </motion.div>
    </motion.div>
  );
}
