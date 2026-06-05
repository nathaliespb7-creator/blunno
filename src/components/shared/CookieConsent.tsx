'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactElement } from 'react';

import {
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  syncAnalyticsConsentFromStorage,
} from '@/lib/analytics';
import { useTranslation } from '@/i18n/useTranslation';

const CONSENT_STORAGE_KEY = 'blunno_analytics_consent';

export function CookieConsent(): ReactElement | null {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    syncAnalyticsConsentFromStorage();
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored === null) {
        setVisible(true);
      }
    } catch {
      // Safari Private Browsing blocks localStorage — show consent banner anyway
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    grantAnalyticsConsent();
    setVisible(false);
  };

  const decline = () => {
    denyAnalyticsConsent();
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t('cookie.label')}
      aria-modal="true"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#120f25]/95 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md sm:inset-x-6"
    >
      <p className="text-sm leading-relaxed text-white/85">
        {t('cookie.text')}{' '}
        <Link href="/privacy" className="text-[#00FFFF] underline-offset-2 hover:underline">
          {t('landing.privacy')}
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={accept}
          className="rounded-full bg-gradient-to-r from-cyan-400/90 to-fuchsia-600/90 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t('cookie.accept')}
        </button>
        <button
          type="button"
          onClick={decline}
          className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/25 hover:text-white"
        >
          {t('cookie.decline')}
        </button>
      </div>
    </div>
  );
}
