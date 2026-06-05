'use client';

import type { ReactElement } from 'react';

import { RouteErrorFallback } from '@/components/shared/RouteErrorFallback';
import { useTranslation } from '@/i18n/useTranslation';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PlayError({ reset }: ErrorProps): ReactElement {
  const { t } = useTranslation();

  return (
    <RouteErrorFallback
      title={t('error.playTitle')}
      message={t('error.playMessage')}
      reset={reset}
    />
  );
}
