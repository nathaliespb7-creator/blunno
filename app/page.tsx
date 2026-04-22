'use client';

import { motion } from 'framer-motion';
import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';

import { BlunnoBlob } from '@/components/shared/BlunnoBlob';
import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';
import { cn } from '@/lib/utils';

export default function WelcomePage(): ReactElement {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleBlobClick = async () => {
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
          onClick={handleBlobClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              void handleBlobClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Go to mood selection"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="blunno-focus-visible relative min-w-0 cursor-pointer rounded-full outline-none"
        >
          <motion.div
            animate={{
              opacity: isHovered ? 0.55 : 0.28,
              scale: isHovered ? 1.06 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(94,234,212,0.18),rgba(167,139,250,0.12),transparent_72%)] blur-[64px]"
          />

          <div className="relative z-20 flex min-w-0 justify-center">
            <BlunnoBlob className="shrink-0" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className={cn(
            'mt-8 flex w-full min-w-0 max-w-md flex-col items-center justify-center px-4 sm:max-w-lg md:mt-12'
          )}
        >
          {/* Figma: #241305 на тёмном фоне нечитаем — белый для WCAG AA */}
          <h2
            className={cn(
              'font-welcome w-full max-w-[min(100%,28rem)] break-words text-balance font-bold leading-tight text-white',
              'text-3xl sm:text-4xl md:text-[38px]',
              '[text-shadow:0_4px_4px_rgba(0,0,0,0.25)]'
            )}
          >
            No stress, no mess
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22 }}
            className={cn(
              'mt-2 w-full max-w-[min(100%,28rem)] text-balance',
              'flex flex-wrap items-baseline justify-center gap-x-2 gap-y-2 uppercase leading-snug'
            )}
            aria-label="JUST BLUNNO BEST"
          >
            <span className="font-welcome text-[22px] text-white/95 sm:text-2xl [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              JUST
            </span>
            <span
              className="font-welcome text-[26px] text-[var(--color-accent-primary)] sm:text-3xl [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]"
            >
              BLUNNO
            </span>
            <span className="font-welcome text-[22px] text-white/95 sm:text-2xl [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              BEST
            </span>
          </motion.p>

          <p className="mt-6 max-w-xs text-center font-ui text-sm leading-snug text-[color:var(--color-text-secondary)]">
            Tap Blunno to continue — one gentle next step.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
