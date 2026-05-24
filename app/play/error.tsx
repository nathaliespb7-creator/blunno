'use client';

import type { ReactElement } from 'react';

import { RouteErrorFallback } from '@/components/shared/RouteErrorFallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PlayError({ reset }: ErrorProps): ReactElement {
  return (
    <RouteErrorFallback
      title="Play mode hit a snag"
      message="Something went wrong while loading games. You can try again or return to Choose."
      reset={reset}
    />
  );
}
