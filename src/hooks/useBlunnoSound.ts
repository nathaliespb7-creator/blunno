'use client';

import { useCallback } from 'react';

import { audioService, type BlunnoSoundName } from '@/services/audioService';

export function useBlunnoSound() {
  const ensureUnlocked = useCallback(async () => {
    await audioService.ensureUnlocked();
  }, []);

  const play = useCallback(async (name: BlunnoSoundName) => {
    await audioService.play(name);
  }, []);

  return { ensureUnlocked, play };
}
