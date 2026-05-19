'use client';

import { useSyncExternalStore } from 'react';

/** True on client after hydration — avoids SSR/client mismatch for motion. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
