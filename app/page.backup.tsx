'use client';

import { useEffect } from 'react';
import { Wind, Headphones, Gamepad2 } from 'lucide-react';

import { WelcomeMascot } from '@/components/features/welcome/WelcomeMascot';
import { WelcomeCTA } from '@/components/features/welcome/WelcomeCTA';
import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';

const cards = [
  {
    icon: Wind,
    title: 'SOS breathing',
    description: '3-min reset for exam panic',
    accentColor: '#E07A5F',
  },
  {
    icon: Headphones,
    title: 'Focus sounds',
    description: 'Study ambience offline',
    accentColor: '#7BA89A',
  },
  {
    icon: Gamepad2,
    title: 'Mini breaks',
    description: 'Games to reset',
    accentColor: '#9D84B7',
  },
];

export default function MarketingLandingPage() {
  useEffect(() => {
    document.documentElement.classList.add('landing-route');
    return () => {
      document.documentElement.classList.remove('landing-route');
    };
  }, []);

  return (
    <div className="relative h-screen h-[100dvh] overflow-hidden bg-[#05050A] font-sans flex flex-col items-center justify-between px-4 py-3 sm:py-5 md:py-8">
      <div className="v81-ambient-glow-a" aria-hidden />
      <div className="v81-ambient-glow-b" aria-hidden />

      <div className="relative z-10 flex flex-col items-center justify-between w-full max-w-4xl mx-auto flex-1 h-full min-h-0 gap-3 md:gap-6">
        <div className="text-center w-full flex flex-col items-center justify-center flex-1 min-h-0 py-1 md:py-2">
          <div className="w-[20vh] h-[20vh] min-h-[90px] max-h-[220px] mx-auto mb-2 md:mb-5 animate-landing-float flex-shrink min-h-0 relative">
            <WelcomeMascot className="landing-hero-mascot !h-full !w-full !max-w-none" />
          </div>

          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-wide mb-0.5 md:mb-2 leading-tight"
            style={{ fontFamily: 'var(--font-tiro-telugu), serif' }}
          >
            Blunno
          </h1>

          <p className="text-[#00FFFF] text-xs sm:text-sm md:text-base lg:text-lg font-medium tracking-wide">
            Your pocket reset for study stress
          </p>

          <p className="text-[10px] sm:text-xs md:text-sm text-[#9CA3AF] mt-0.5 md:mt-1">
            Free · Offline · No signup
          </p>

          <div className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[280px] mt-3 md:mt-6">
            <WelcomeCTA href="/app" label="Try Blunno" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-5 w-full mt-auto">
          {cards.map((card) => (
            <div
              key={card.title}
              className="relative bg-[rgba(255,255,255,0.03)] backdrop-blur-[12px] rounded-[16px] md:rounded-[24px] p-2.5 sm:p-4 md:p-5 text-center transition-all duration-300 group overflow-hidden hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,255,255,0.08)] flex flex-col justify-center min-h-[90px] sm:min-h-[110px] md:min-h-[130px]"
              style={
                {
                  '--v81-cell-border': card.accentColor,
                } as React.CSSProperties
              }
            >
              <GlassCellDecor borderColor={card.accentColor} />
              <card.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#00FFFF] mx-auto mb-1.5 sm:mb-2 md:mb-3 relative z-10" />
              <h3 className="text-white text-[10px] sm:text-xs md:text-base font-semibold mb-0.5 md:mb-1 relative z-10 leading-tight">
                {card.title}
              </h3>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-[#9CA3AF] relative z-10 leading-tight line-clamp-2 md:line-clamp-none">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-auto pt-2 md:pt-4 text-center text-[9px] md:text-[11px] text-[#6B7280] border-t border-white/10 w-full max-w-md">
          <p>Blunno — pocket reset for study stress</p>
          <p className="mt-0.5">
            <a
              href="mailto:hello@blunno.app"
              className="hover:text-[#00FFFF] transition-colors"
            >
              Send feedback
            </a>
            {' · © 2026'}
          </p>
        </footer>
      </div>
    </div>
  );
}
