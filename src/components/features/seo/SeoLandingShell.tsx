import Link from 'next/link';
import type { ReactNode } from 'react';

import { SeoLandingCta } from '@/components/features/seo/SeoLandingCta';

type SeoLandingShellProps = {
  children: ReactNode;
  ctaLabel: string;
  ctaHref?: string;
};

export function SeoLandingShell({
  children,
  ctaLabel,
  ctaHref = '/app',
}: SeoLandingShellProps) {
  return (
    <div className="landing-page font-sans">
      <div className="v81-ambient-glow-a" aria-hidden />
      <div className="v81-ambient-glow-b" aria-hidden />
      <div className="landing-inner">
        <header className="landing-section pt-8 pb-2">
          <Link
            href="/"
            className="text-sm font-semibold text-[color:var(--color-core-planner)] transition-colors hover:text-white"
          >
            ← Blunno
          </Link>
        </header>

        <article className="landing-section space-y-8 pt-4">{children}</article>

        <section className="landing-section flex justify-center pb-8">
          <SeoLandingCta href={ctaHref} label={ctaLabel} />
        </section>

        <footer className="landing-footer">
          <p className="landing-footer-copy">Blunno — карманный ресет для учебного стресса</p>
          <p className="landing-footer-tagline">Бесплатно · Офлайн · Без регистрации</p>
          <Link href="/privacy" className="landing-footer-link">
            Privacy
          </Link>
        </footer>
      </div>
    </div>
  );
}

type SeoStepProps = {
  step: number;
  title: string;
  description: string;
  accent: string;
};

export function SeoStep({ step, title, description, accent }: SeoStepProps) {
  return (
    <li
      className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      style={{ borderColor: `color-mix(in srgb, ${accent} 28%, transparent)` }}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        style={{ background: `color-mix(in srgb, ${accent} 35%, #120f25)` }}
        aria-hidden
      >
        {step}
      </span>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-white/65">{description}</p>
      </div>
    </li>
  );
}

type SeoFeatureCardProps = {
  title: string;
  description: string;
  accent: string;
};

export function SeoFeatureCard({ title, description, accent }: SeoFeatureCardProps) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
      style={{ borderColor: `color-mix(in srgb, ${accent} 28%, transparent)` }}
    >
      <div
        className="mb-3 h-1 w-10 rounded-full"
        style={{ background: accent }}
        aria-hidden
      />
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{description}</p>
    </div>
  );
}
