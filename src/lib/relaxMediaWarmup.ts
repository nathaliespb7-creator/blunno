/** Warm relax MP3 into the service worker static cache (once per session). */
export async function warmRelaxMediaInCache(urls: string[]): Promise<void> {
  if (typeof window === 'undefined' || urls.length === 0) {
    return;
  }

  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) {
      return;
    }

    await Promise.allSettled(
      urls.map((url) =>
        fetch(url, {
          cache: 'force-cache',
          credentials: 'same-origin',
        })
      )
    );
  } catch {
    /* best-effort — offline playback may still work from install precache */
  }
}
