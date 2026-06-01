'use client';

import { useEffect, type ReactElement } from 'react';

import { unlockAudioSession } from '@/lib/navigationSound';

/**
 * iOS/Android: resume Web Audio on first touch so Howler sounds work for later
 * navigation (useEffect) and task toggles. Capture phase runs before link navigation.
 */
export function AudioUnlock(): ReactElement | null {
  useEffect(() => {
    const onFirstInteraction = () => {
      void unlockAudioSession();
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
      document.removeEventListener('pointerdown', onFirstInteraction);
    };

    document.addEventListener('click', onFirstInteraction, { capture: true });
    document.addEventListener('touchstart', onFirstInteraction, { capture: true, passive: true });
    document.addEventListener('pointerdown', onFirstInteraction, { capture: true, passive: true });

    return () => {
      document.removeEventListener('click', onFirstInteraction, { capture: true });
      document.removeEventListener('touchstart', onFirstInteraction, { capture: true });
      document.removeEventListener('pointerdown', onFirstInteraction, { capture: true });
    };
  }, []);

  return null;
}
