'use client';

import { useEffect, type ReactElement } from 'react';

import { ModeScreenTopBar } from '@/components/shared/make-v81/ModeScreenTopBar';
import { MoodTile } from '@/components/shared/make-v81/MoodTile';
import { MOOD_HREFS, V81_MOODS } from '@/components/shared/make-v81/moods';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/analytics';

export default function ChoosePage(): ReactElement {
  const { t } = useTranslation();

  useEffect(() => {
    if (!navigator.onLine) return;

    const prefetchRoutes = async () => {
      for (const route of Object.values(MOOD_HREFS)) {
        try {
          await fetch(route, { credentials: 'same-origin' });
        } catch {
          /* prefetch is best-effort */
        }
      }
    };

    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => void prefetchRoutes(), { timeout: 4000 });
    } else {
      timeoutId = window.setTimeout(() => void prefetchRoutes(), 2500);
    }

    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const translatedMoods = V81_MOODS.map((mood) => ({
    ...mood,
    label: t(`choose.${mood.id}`, mood.label),
    description: t(`choose.${mood.id}.desc`, mood.description),
  }));

  return (
    <ScreenFrame className="v81-screen--choose">
      <ModeScreenTopBar
        title={t('choose.title')}
        backHref="/app"
        backLabel={t('nav.back')}
        homeHref="/app"
        homeLabel={t('nav.exit')}
      />

      <div className="flex min-h-0 flex-1 flex-col items-center">
        <nav
          className="v81-glass-cell-list v81-glass-cell-list--centered w-full max-w-[340px]"
          aria-label={t('choose.title')}
        >
          {translatedMoods.map((mood, index) => (
            <MoodTile
              key={mood.id}
              mood={mood}
              href={MOOD_HREFS[mood.id] ?? '/choose'}
              delayIndex={index}
              onNavigate={() => trackEvent('mood_select', { mood_id: mood.id })}
            />
          ))}
        </nav>
      </div>
    </ScreenFrame>
  );
}
