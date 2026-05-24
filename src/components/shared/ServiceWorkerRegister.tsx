'use client';

import { useEffect, type ReactElement } from 'react';

import { OFFLINE_SW_VERSION } from '@/lib/offlineSwVersion';

export function ServiceWorkerRegister(): ReactElement | null {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    void (async () => {
      try {
        const registration = await navigator.serviceWorker.register(`/sw.js?v=${OFFLINE_SW_VERSION}`, {
          scope: '/',
          updateViaCache: 'none',
        });

        if (navigator.onLine) {
          await registration.update().catch(() => {
            /* offline update check fails expectedly */
          });
        }

        if (navigator.serviceWorker.controller) return;
        if (window.sessionStorage.getItem('blunno-sw-reloaded') === '1') return;

        const handleControllerChange = () => {
          window.sessionStorage.setItem('blunno-sw-reloaded', '1');
          window.location.reload();
        };

        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange, {
          once: true,
        });
      } catch {
        /* best-effort registration; app should still work online */
      }
    })();
  }, []);

  return null;
}
