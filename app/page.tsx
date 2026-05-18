'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

import { BlunnoBlob } from '@/components/shared/BlunnoBlob';
import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';
import { cn } from '@/lib/utils';
import { BLUNNO_MASCOT_PNG } from '@/lib/assets';

export default function WelcomePage(): ReactElement {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const [sloganVariant, setSloganVariant] = useState<'welcome' | 'ui'>('welcome');

  useEffect(() => {
    // A/B check: /?slogan=ui for UI font; default keeps brand display font.
    const query = new URLSearchParams(window.location.search);
    setSloganVariant(query.get('slogan') === 'ui' ? 'ui' : 'welcome');
  }, []);

  const handleStartNow = async () => {
    await unlockAudioSession();
    playNavigationHoverSoft();
    router.push('/choose');
  };

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={BLUNNO_MASCOT_PNG} />
      </Head>
      <div
        className={cn(
          'fixed inset-0 z-0 flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden bg-[var(--welcome-bg)]',
          'px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]'
        )}
      >
        {/* Grain + subtle tonal depth */}
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              'radial-gradient(120% 85% at 50% 0%, color-mix(in srgb, var(--welcome-primary) 14%, transparent) 0%, transparent 62%), linear-gradient(180deg, var(--welcome-bg) 0%, var(--welcome-surface-lowest) 100%)',
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
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
                opacity: isHovered ? 0.58 : 0.3,
                scale: isHovered ? 1.06 : 1,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.5 }}
              className="absolute inset-0 rounded-full blur-[64px]"
              style={{
                background:
                  'radial-gradient(circle at 50% 40%, var(--welcome-glow-primary), var(--welcome-glow-secondary), transparent 72%)',
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
                'font-welcome w-full max-w-[min(100%,28rem)] break-words text-balance font-bold leading-[1.05] tracking-tight text-[var(--welcome-on-surface)]',
                'text-5xl sm:text-6xl md:text-7xl'
              )}
              style={{ textShadow: 'var(--welcome-text-shadow)' }}
            >
              Blunno
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.22 }}
              className={cn(
                'mt-3 w-full max-w-[min(100%,24rem)] text-balance leading-snug text-[var(--welcome-on-surface-variant)] sm:mt-4',
                sloganVariant === 'ui'
                  ? 'font-ui text-base font-medium sm:text-lg'
                  : 'font-welcome text-xl sm:text-2xl'
              )}
            >
              Your pocket reset for study stress
            </motion.p>

            <button
              type="button"
              onClick={() => {
                void handleStartNow();
              }}
              className="welcome-btn-primary blunno-focus-visible mt-8 w-full max-w-[min(100%,20rem)] sm:mt-10"
            >
              Start now
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
