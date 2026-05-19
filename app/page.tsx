'use client';

import { useReducedMotion } from 'framer-motion';
import { type ReactElement } from 'react';
import { useRouter } from 'next/navigation';

import { WelcomeCTA } from '@/components/features/welcome/WelcomeCTA';
import { WelcomeMascot } from '@/components/features/welcome/WelcomeMascot';
import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';
import { cn } from '@/lib/utils';

export default function WelcomePage(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const handleStartNow = async () => {
    await unlockAudioSession();
    playNavigationHoverSoft();
    router.push('/choose');
  };

  return (
    <main
      className={cn(
        'font-[family-name:var(--font-plus-jakarta)]',
        'fixed inset-0 z-0 overflow-hidden',
        'flex items-stretch justify-center'
      )}
      style={{ background: 'var(--welcome-bg-gradient)' }}
    >
      <div
        className={cn(
          'pointer-events-none absolute rounded-full',
          !reduceMotion && 'welcome-bg-blob-a'
        )}
        style={{
          top: '-10%',
          left: '10%',
          width: '80%',
          height: '40%',
          opacity: 0.35,
          background:
            'radial-gradient(ellipse at center, rgba(93,63,224,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute rounded-full',
          !reduceMotion && 'welcome-bg-blob-b'
        )}
        style={{
          bottom: '0%',
          right: '-20%',
          width: '100%',
          height: '50%',
          opacity: 0.25,
          background:
            'radial-gradient(ellipse at center, rgba(124,90,255,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        aria-hidden
      />

      {/* Make v23 frame: 393×852 — content top-[120px], CTA bottom pb-[72px] */}
      <div className="relative z-10 mx-auto min-h-dvh h-dvh w-full max-w-[393px] shrink-0">
        <div className="absolute inset-x-0 top-[calc(var(--welcome-content-top)+env(safe-area-inset-top))] z-10 flex flex-col items-center px-6 text-center">
          <WelcomeMascot />

          <div className="mt-4 flex flex-col items-center space-y-3">
            <h1
              className={cn(
                'bg-clip-text text-[48px] font-normal leading-[1.1] text-transparent',
                !reduceMotion && 'welcome-enter welcome-enter-delay-1'
              )}
              style={{
                fontFamily: 'var(--font-tiro-telugu), serif',
                backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #C4B5FD 100%)',
                filter: 'drop-shadow(0px 4px 20px rgba(124, 90, 255, 0.15))',
              }}
            >
              Blunno
            </h1>

            <p
              className={cn(
                'max-w-[280px] text-[17px] font-normal leading-[1.4] tracking-[0.02em] opacity-90',
                !reduceMotion && 'welcome-enter welcome-enter-delay-2'
              )}
              style={{
                color: 'var(--welcome-subtitle)',
                textShadow: '0 2px 10px var(--welcome-subtitle-glow)',
              }}
            >
              Your pocket reset for any stress
            </p>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center px-6"
          style={{ paddingBottom: 'calc(var(--welcome-cta-bottom) + env(safe-area-inset-bottom))' }}
        >
          <WelcomeCTA className="w-full" onClick={() => void handleStartNow()} />
        </div>
      </div>
    </main>
  );
}
