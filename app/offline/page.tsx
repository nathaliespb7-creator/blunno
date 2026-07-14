'use client';

import type { ReactElement } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

export default function OfflinePage(): ReactElement {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0f1026] px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">{t('offline.title')}</h1>
        <p className="mb-4 text-sm text-white/75">
          {t('offline.text')}
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
        >
          {t('error.tryAgain')}
        </a>
      </div>
    </main>
  );
}
