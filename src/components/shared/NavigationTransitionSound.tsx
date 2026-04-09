'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactElement } from 'react';

import { playNavigationHoverSoft, unlockAudioSession } from '@/lib/navigationSound';

let lastKnownPath: string | null = null;
let userHasInteracted = false;
let audioUnlockPromise: Promise<void> | null = null;

export function NavigationTransitionSound(): ReactElement | null {
  const pathname = usePathname();

  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (userHasInteracted) return;
      userHasInteracted = true;
      console.log('[nav] User interaction detected, unlocking audio');
      
      // Unlock audio session and wait for completion
      try {
        audioUnlockPromise = unlockAudioSession();
        await audioUnlockPromise;
        console.log('[nav] Audio unlock completed successfully');
      } catch (e) {
        console.warn('[nav] Audio unlock failed:', e);
      }
      
      // Remove event listeners
      document.removeEventListener('click', handleFirstInteraction, { capture: true });
      document.removeEventListener('touchstart', handleFirstInteraction, { capture: true });
      document.removeEventListener('keydown', handleFirstInteraction, { capture: true });
      document.removeEventListener('pointerdown', handleFirstInteraction, { capture: true });
    };

    // Use capture phase to ensure we catch the interaction early
    // Include pointerdown for better mobile support
    document.addEventListener('click', handleFirstInteraction, { capture: true });
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true, capture: true });
    document.addEventListener('keydown', handleFirstInteraction, { capture: true });
    document.addEventListener('pointerdown', handleFirstInteraction, { passive: true, capture: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction, { capture: true });
      document.removeEventListener('touchstart', handleFirstInteraction, { capture: true });
      document.removeEventListener('keydown', handleFirstInteraction, { capture: true });
      document.removeEventListener('pointerdown', handleFirstInteraction, { capture: true });
    };
  }, []);

  useEffect(() => {
    if (lastKnownPath === null) {
      lastKnownPath = pathname;
      console.log('[nav] Initial route:', pathname);
      return;
    }
    if (lastKnownPath !== pathname) {
      console.log('[nav] Route changed from', lastKnownPath, 'to', pathname);
      if (userHasInteracted) {
        console.log('[nav] User has interacted, playing navigation sound with delay');
        
        // Wait for audio unlock if still in progress, then play sound
        const playSound = async () => {
          try {
            if (audioUnlockPromise) {
              console.log('[nav] Waiting for audio unlock to complete...');
              await audioUnlockPromise;
            }
            
            // Add delay to ensure audio context is fully ready
            setTimeout(() => {
              console.log('[nav] Playing navigation sound now');
              playNavigationHoverSoft();
            }, 100);
          } catch (e) {
            console.warn('[nav] Error waiting for audio unlock:', e);
            // Try to play anyway
            setTimeout(() => {
              playNavigationHoverSoft();
            }, 100);
          }
        };
        
        void playSound();
      } else {
        console.log('[nav] User has not interacted yet, skipping sound');
      }
      lastKnownPath = pathname;
    }
  }, [pathname]);

  return null;
}
