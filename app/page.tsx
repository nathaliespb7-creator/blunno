'use client';

import { useEffect } from 'react';

import { WelcomeCTA } from '@/components/features/welcome/WelcomeCTA';

export default function MarketingLandingPage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-route');
    return () => {
      document.documentElement.classList.remove('landing-route');
    };
  }, []);

  return (
    <div className="relative h-screen h-[100dvh] overflow-hidden overflow-y-auto font-sans flex flex-col items-center justify-between px-4 py-6 sm:py-8 md:py-12" style={{ backgroundColor: '#120f25', minHeight: '100vh', minHeight: '-webkit-fill-available' }}>
      <div className="v81-ambient-glow-a" aria-hidden />
      <div className="v81-ambient-glow-b" aria-hidden />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto flex-1 h-full min-h-0 gap-6 md:gap-10">
        <div className="text-center w-full flex flex-col items-center justify-center py-2">
          <h1
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-wide mb-1 md:mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-tiro-telugu), serif' }}
          >
            Blunno
          </h1>

          <p className="text-cyan-400 text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wide">
            Your pocket reset for study stress
          </p>

          <p className="text-[11px] sm:text-xs md:text-sm text-white/60 mt-1 md:mt-2 uppercase tracking-[0.15em]">
            Free · Offline · No signup
          </p>

          <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] mt-6 md:mt-8">
            <WelcomeCTA href="/app" label="Try Blunno" analyticsEvent="try_blunno" />
          </div>

          {/* Elegant minimalist typographic block describing features */}
          <div className="mt-10 md:mt-14 flex flex-col items-center space-y-2 text-center px-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cyan-400/60 font-semibold">
              Inside the app
            </p>
            <p className="text-xs sm:text-sm md:text-base text-white/60 font-medium max-w-md text-balance leading-relaxed">
              SOS breathing for exam panic · Focus sounds for deep study · Mindful planner for daily tasks · Mini breaks to reset your mind
            </p>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-auto pt-4 text-center text-[9px] md:text-[11px] text-white/50 border-t border-white/10 w-full max-w-md">
        <p>Blunno — pocket reset for study stress</p>
        <p className="mt-0.5">
          <a
            href="mailto:hello@blunno.app"
            className="hover:text-cyan-400 transition-colors"
          >
            Send feedback
          </a>
          {' · '}
          <a href="/privacy" className="hover:text-cyan-400 transition-colors">
            Privacy
          </a>
          {' · © 2026'}
        </p>
      </footer>
    </div>
  );
}
