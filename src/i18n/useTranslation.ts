'use client';

import { useLocale } from './I18nProvider';
import enDict from './en.json';
import ruDict from './ru.json';

const translations: Record<string, Record<string, string>> = {
  en: enDict,
  ru: ruDict,
};

export function useTranslation() {
  const { locale } = useLocale();

  function t(key: string, fallback?: string): string;
  function t(key: string, params?: Record<string, string | number>): string;
  function t(key: string, arg?: string | Record<string, string | number>): string {
    let value = translations[locale]?.[key] ?? translations.en?.[key] ?? key;
    if (typeof arg === 'string') {
      value = value === key ? arg : value;
    } else if (arg) {
      for (const [k, v] of Object.entries(arg)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  }

  return { t, locale };
}
