'use client';

import { useTranslation } from '@/i18n/useTranslation';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-[family-name:var(--font-plus-jakarta)] text-6xl font-bold text-white/90">404</h1>
      <p className="mt-4 text-lg text-white/60">
        {t('error.404')}
      </p>
      {/* A full navigation recovers cleanly from an unknown route. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-cyan-400/90 to-fuchsia-600/90 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        {t('error.goHome')}
      </a>
    </main>
  );
}
