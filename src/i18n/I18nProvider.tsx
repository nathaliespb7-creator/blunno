'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
} from './locale';
import type { Locale } from './types';

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nContextType>({ locale: 'en', setLocale: () => {} });

export function useLocale() {
  return useContext(I18nContext);
}

function persistLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* private browsing */
  }
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
}

type I18nProviderProps = {
  children: ReactNode;
  initialLocale?: Locale;
};

export function I18nProvider({ children, initialLocale = 'en' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useLayoutEffect(() => {
    persistLocale(locale);
  }, [locale]);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7876/ingest/c382d466-b827-4be9-8387-43085e568544',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'127c83'},body:JSON.stringify({sessionId:'127c83',location:'I18nProvider.tsx:mount',message:'locale hydrated',data:{initialLocale,locale,htmlLang:document.documentElement.lang,datasetLocale:document.documentElement.dataset.locale},timestamp:Date.now(),hypothesisId:'A',runId:'post-fix'})}).catch(()=>{});
    // #endregion
  }, [initialLocale, locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    persistLocale(l);
  }, []);

  return <I18nContext.Provider value={{ locale, setLocale }}>{children}</I18nContext.Provider>;
}
