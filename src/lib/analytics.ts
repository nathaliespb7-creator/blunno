/** GA4 measurement ID — also configured in app/layout.tsx */
export const GA_MEASUREMENT_ID = 'G-QH796CJ4ZX';

const CONSENT_STORAGE_KEY = 'blunno_analytics_consent';

export type AnalyticsEventName =
  | 'try_blunno'
  | 'start_now'
  | 'mood_select'
  | 'relax_play'
  | 'relax_pause'
  | 'sos_session_start'
  | 'sos_session_complete'
  | 'sos_session_stop'
  | 'play_game_open'
  | 'planner_task_add'
  | 'planner_task_toggle';

export type AnalyticsEventParams = {
  mood_id?: string;
  sound_id?: string;
  sound_name?: string;
  mode?: 'guided' | 'trace';
  game_id?: string;
  completed?: boolean;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_STORAGE_KEY) === 'granted';
}

export function grantAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, 'granted');
  window.gtag?.('consent', 'update', {
    analytics_storage: 'granted',
  });
}

export function denyAnalyticsConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, 'denied');
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
  });
}

/** Call once on mount (e.g. CookieConsent) to restore prior consent. */
export function syncAnalyticsConsentFromStorage(): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  if (stored === 'granted') {
    window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  params?: AnalyticsEventParams
): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  window.gtag?.('event', name, params ?? {});
}
