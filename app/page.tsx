'use client';

import { useEffect, type ReactElement } from 'react';

import { LandingFeatures } from '@/components/features/landing/LandingFeatures';
import { LandingFinalCta } from '@/components/features/landing/LandingFinalCta';
import { LandingFooter } from '@/components/features/landing/LandingFooter';
import { LandingHero } from '@/components/features/landing/LandingHero';
import { LandingPwaInstall } from '@/components/features/landing/LandingPwaInstall';

export default function WelcomePage(): ReactElement {
  useEffect(() => {
    document.documentElement.classList.add('welcome-route');
    return () => {
      document.documentElement.classList.remove('welcome-route');
    };
  }, []);

  return (
    <main className="landing-page font-[family-name:var(--font-plus-jakarta)]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-35"
        style={{
          background:
            'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(93,63,224,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse 100% 50% at 100% 100%, rgba(124,90,255,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        aria-hidden
      />

      <div className="landing-inner relative z-10">
        <LandingHero />
        <LandingFeatures />
        <LandingPwaInstall />
        <LandingFinalCta />
        <LandingFooter />
      </div>
    </main>
  );
}
