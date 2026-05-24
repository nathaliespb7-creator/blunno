'use client';

import type { ReactElement } from 'react';

import { RouteErrorFallback } from '@/components/shared/RouteErrorFallback';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SosError({ reset }: ErrorProps): ReactElement {
  return (
    <RouteErrorFallback
      title="SOS mode hit a snag"
      message="Something went wrong during the breathing session. You can try again or return to Choose."
      reset={reset}
    />
  );
}
