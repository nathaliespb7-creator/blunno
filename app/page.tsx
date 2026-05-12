'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';

import { BlunnoBlob } from '@/components/shared/BlunnoBlob';
import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';
import { cn } from '@/lib/utils';

export default function WelcomePage(): ReactElement {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleStartNow = async () => {
    await unlockAudioSession();
    playNavigationHoverSoft();
    router.push('/choose');
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-0 flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden bg-blunno-bg',
        'px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]'
      )}
    >
      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%2780%27 height=%2780%27 filter=%27url(%23n)%27 opacity=%270.45%27/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative z-10 flex min-h-0 min-w-0 w-full max-w-[min(100%,394px)] flex-col items-center justify-center text-center">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-hidden
          className="relative min-w-0 select-none rounded-full"
        >
          <motion.div
            animate={{
              opacity: isHovered ? 0.55 : 0.28,
              scale: isHovered ? 1.06 : 1,
            }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            className="absolute inset-0 rounded-full blur-[64px]"
            style={{
              background:
                'radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-core-planner) 26%, transparent), color-mix(in srgb, var(--color-core-play) 18%, transparent), transparent 72%)',
            }}
          />

          <div className="relative z-20 flex min-w-0 justify-center">
            <BlunnoBlob className="shrink-0" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className={cn(
            'mt-8 flex w-full min-w-0 max-w-md flex-col items-center justify-center px-4 sm:max-w-lg md:mt-12'
          )}
        >
          <h1
            className={cn(
              'font-welcome w-full max-w-[min(100%,28rem)] break-words text-balance font-bold leading-[1.05] tracking-tight text-white',
              'text-5xl sm:text-6xl md:text-7xl',
              '[text-shadow:0_4px_24px_rgba(0,0,0,0.35)]'
            )}
          >
            Blunno
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.22 }}
            className={cn(
              'mt-3 w-full max-w-[min(100%,24rem)] text-balance font-ui text-base font-medium leading-snug text-white/85 sm:mt-4 sm:text-lg'
            )}
          >
            Your pocket reset for study stress
          </motion.p>

          <button
            type="button"
            onClick={() => {
              void handleStartNow();
            }}
            className="blunno-btn-primary blunno-focus-visible mt-8 w-full max-w-[min(100%,20rem)] sm:mt-10"
          >
            Start now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
