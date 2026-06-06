import type { Locale } from './types';

export const LOCALE_STORAGE_KEY = 'blunno_lang';
export const LOCALE_COOKIE_KEY = 'blunno_lang';

export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return 'en';
  const primary = header.split(',')[0]?.trim().toLowerCase() ?? '';
  if (primary.startsWith('ru')) return 'ru';
  return 'en';
}

export function parseLocale(value: string | null | undefined): Locale | null {
  if (value === 'ru' || value === 'en') return value;
  return null;
}

/** Client-only: localStorage → navigator.language → fallback */
export function detectClientLocale(fallback: Locale = 'en'): Locale {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    const parsed = parseLocale(stored);
    if (parsed) return parsed;
  } catch {
    /* private browsing */
  }
  const nav = navigator.language || (navigator as Navigator & { userLanguage?: string }).userLanguage || '';
  if (nav.startsWith('ru')) return 'ru';
  return fallback;
}

export const LOCALE_BOOTSTRAP_SCRIPT = `(function(){try{var k='blunno_lang',p='; '+document.cookie,s=p.split('; '+k+'='),c=s.length===2?s.pop().split(';').shift():null,l=(c==='ru'||c==='en')?c:((navigator.language||'').startsWith('ru')?'ru':'en');document.documentElement.lang=l;document.documentElement.dataset.locale=l;localStorage.setItem(k,l);if(!c){document.cookie=k+'='+l+';path=/;max-age=31536000;samesite=lax'}}catch(e){}})();`;
