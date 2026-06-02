'use client';

import { useEffect, useState } from 'react';
import { WELCOME_MASCOT_PNG } from '@/lib/assets';

const FEATURES = [
  { label: 'SOS Breathing', color: '#905e8c' },
  { label: 'Focus Sounds', color: '#e7b453' },
  { label: 'Mindful Planner', color: '#83a9ad' },
  { label: 'Mini Breaks', color: '#6a3cae' },
] as const;

export default function OgPreviewPage() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const padding = 32; // 16px padding on each side
      const availableWidth = width - padding;
      if (availableWidth < 1200) {
        setScale(availableWidth / 1200);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#0e0d1a] p-4 overflow-hidden">
      <div
        style={{
          width: '1200px',
          height: '630px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out',
        }}
        className="relative flex shrink-0 overflow-hidden rounded-2xl shadow-2xl border border-white/5"
      >
        <div
          className="absolute inset-0 flex h-full w-full"
          style={{
            background: 'linear-gradient(135deg, #0b0b1a 0%, #131121 48%, #1a1530 100%)',
          }}
        >
          {/* Ambient glows */}
          <div
            className="pointer-events-none absolute -right-10 -top-20 h-[620px] w-[620px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(106,60,174,0.35) 0%, rgba(106,60,174,0.12) 42%, rgba(106,60,174,0) 72%)',
            }}
          />
          <div
            className="pointer-events-none absolute right-20 top-10 h-[480px] w-[480px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(145,126,255,0.28) 0%, rgba(145,126,255,0.1) 45%, rgba(145,126,255,0) 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 left-[420px] h-[360px] w-[360px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(131,169,173,0.18) 0%, rgba(131,169,173,0.06) 50%, rgba(131,169,173,0) 72%)',
            }}
          />

          {/* Left column */}
          <div className="relative z-10 flex w-[58%] flex-col justify-center py-[72px] pl-20 pr-8">
            <div className="mb-7 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[13px] font-bold uppercase tracking-[0.18em] text-[#83a9ad]">
              Your pocket reset
            </div>

            <h1
              className="text-[96px] font-normal leading-[1.1] text-[#e5dff6]"
              style={{ fontFamily: 'var(--font-tiro-telugu), serif' }}
            >
              Blunno
            </h1>

            <p className="mt-[22px] max-w-[520px] text-[30px] font-medium leading-[1.25] text-[#c9c4d8]">
              Your pocket reset for study stress
            </p>

            <p className="mt-3.5 text-base font-medium uppercase tracking-[0.14em] text-[#c9c4d8]/70">
              Free · Offline · No signup
            </p>

            <ul className="mt-11 flex flex-col gap-4">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      background: feature.color,
                      boxShadow: `0 0 12px ${feature.color}88`,
                    }}
                  />
                  <span className="text-[22px] font-medium text-[#e5dff6]/90">{feature.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column: mascot */}
          <div className="relative z-10 flex w-[42%] items-center justify-center pr-14">
            <div className="relative flex h-[380px] w-[380px] items-center justify-center">
              <div
                className="absolute h-[340px] w-[340px] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(124,90,255,0.45) 0%, rgba(124,90,255,0.18) 38%, rgba(124,90,255,0) 72%)',
                }}
              />
              <div
                className="absolute h-[280px] w-[280px] rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(201,191,255,0.35) 0%, rgba(201,191,255,0.12) 50%, rgba(201,191,255,0) 75%)',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={WELCOME_MASCOT_PNG}
                alt=""
                width={320}
                height={320}
                className="relative object-contain"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
