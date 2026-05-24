'use client';

import { useEffect, type ReactElement } from 'react';

import { ModeScreenTopBar } from '@/components/shared/make-v81/ModeScreenTopBar';
import { MoodTile } from '@/components/shared/make-v81/MoodTile';
import { MOOD_HREFS, V81_MOODS } from '@/components/shared/make-v81/moods';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';
import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';

export default function ChoosePage(): ReactElement {
  useEffect(() => {
    if (!navigator.onLine) return;

    void (async () => {
      for (const route of Object.values(MOOD_HREFS)) {
        try {
          await fetch(route, { credentials: 'same-origin' });
        } catch {
          /* prefetch is best-effort */
        }
      }
    })();
  }, []);

  const handleModeNavigate = () => {
    void (async () => {
      try {
        await unlockAudioSession();
        playNavigationHoverSoft();
      } catch {
        /* navigation must not depend on sound */
      }
    })();
  };

  return (
    <ScreenFrame className="v81-screen--choose">
      <ModeScreenTopBar
        title="Choose Your Mood"
        backHref="/"
        backLabel="Back"
        homeHref="/"
        homeLabel="Exit to welcome screen"
      />

      <div className="flex min-h-0 flex-1 flex-col items-center">
        <nav
          className="v81-glass-cell-list v81-glass-cell-list--centered w-full max-w-[340px]"
          aria-label="Choose your mood"
        >
          {V81_MOODS.map((mood, index) => (
            <MoodTile
              key={mood.id}
              mood={mood}
              href={MOOD_HREFS[mood.id] ?? '/choose'}
              delayIndex={index}
              onNavigate={handleModeNavigate}
            />
          ))}
        </nav>
      </div>
    </ScreenFrame>
  );
}
