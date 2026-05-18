'use client';

import { motion } from 'framer-motion';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { type ReactElement } from 'react';
import { useRouter } from 'next/navigation';

import { BlunnoBlob } from '@/components/shared/BlunnoBlob';
import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';
import { cn } from '@/lib/utils';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
});

export default function WelcomePage(): ReactElement {
  const router = useRouter();

  const handleStartNow = async () => {
    await unlockAudioSession();
    playNavigationHoverSoft();
    router.push('/choose');
  };

  return (
    <main
      className={cn(
        plusJakartaSans.className,
        'fixed inset-0 z-0 flex flex-col items-center justify-center overflow-x-hidden overflow-y-hidden',
        'bg-[#131121] px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]'
      )}
    >
      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center text-center">
        <div
          className="pointer-events-none absolute -top-8 h-56 w-56 rounded-full blur-[64px]"
          style={{
            background: 'radial-gradient(circle, rgba(201,191,255,0.32) 0%, rgba(155,208,208,0.18) 48%, transparent 74%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-9"
          aria-hidden
        >
          <BlunnoBlob className="shrink-0" />
        </motion.div>

        <h1
          className="text-[40px] font-extrabold leading-[1.06] tracking-[0.01em] text-[#e5dff6] sm:text-[46px]"
          style={{ textShadow: '0 4px 22px rgba(201,191,255,0.26)' }}
        >
          Blunno
        </h1>

        <p className="mt-4 max-w-[320px] text-balance text-[20px] font-normal leading-[1.35] text-[#c9c4d8]">
          Your pocket reset for study stress
        </p>

        <button
          type="button"
          onClick={() => {
            void handleStartNow();
          }}
          className={cn(
            'blunno-focus-visible mx-auto mt-10 w-full max-w-[280px] rounded-full px-8 py-[14px]',
            'text-center text-[18px] font-bold uppercase tracking-[0.06em] text-[#2e009c]',
            'transition duration-200 ease-out hover:scale-[1.02]',
            'focus-visible:scale-[1.02] active:scale-[0.99]'
          )}
          style={{
            background: 'linear-gradient(135deg, #917eff 0%, #c9bfff 100%)',
            boxShadow: '0 0 15px rgba(145, 126, 255, 0.5)',
          }}
        >
          START NOW
        </button>
      </div>
    </main>
  );
}
