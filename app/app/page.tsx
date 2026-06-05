'use client';

import { useEffect, type ReactElement } from 'react';

import { WelcomeCTA } from '@/components/features/welcome/WelcomeCTA';
import { WelcomeMascot } from '@/components/features/welcome/WelcomeMascot';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

export default function WelcomePage(): ReactElement {
  const { t } = useTranslation();
  useEffect(() => {
    document.documentElement.classList.add('welcome-route');
    return () => {
      document.documentElement.classList.remove('welcome-route');
    };
  }, []);

  return (
    <main className={cn('welcome-screen', 'font-[family-name:var(--font-plus-jakarta)]')}>
      <div
        className="pointer-events-none absolute rounded-full"
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
        className="pointer-events-none absolute rounded-full"
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

      <div className="welcome-frame">
        <div className="welcome-content">
          <WelcomeMascot />

          <div className="welcome-copy mt-4 flex shrink-0 flex-col items-center space-y-3">
            <h1 className="welcome-title">Blunno</h1>

            <p className="welcome-subtitle">
              {t('landing.title')}
            </p>
          </div>
        </div>

        <div className="welcome-cta-bar">
          <WelcomeCTA href="/choose" label={t('nav.start')} analyticsEvent="start_now" />
        </div>
      </div>
    </main>
  );
}
