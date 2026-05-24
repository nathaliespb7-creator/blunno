'use client';

import type { ReactElement } from 'react';

import { RouteErrorFallback } from '@/components/shared/RouteErrorFallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RelaxError({ reset }: ErrorProps): ReactElement {
  return (
    <RouteErrorFallback
      title="Relax mode hit a snag"
      message="Something went wrong while loading sounds. You can try again or return to Choose."
      reset={reset}
    />
  );
}
