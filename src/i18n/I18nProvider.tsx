'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Locale } from './types';

const STORAGE_KEY = 'blunno_lang';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ru' || stored === 'en') return stored;
  } catch {}
  const nav = navigator.language || (navigator as any).userLanguage || '';
  if (nav.startsWith('ru')) return 'ru';
  return 'en';
}

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextType>({ locale: 'en', setLocale: () => {} });

export function useLocale() {
  return useContext(I18nContext);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}
