'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

type RouteErrorFallbackProps = {
  title: string;
  message: string;
  reset: () => void;
};

export function RouteErrorFallback({
  title,
  message,
  reset,
}: RouteErrorFallbackProps): ReactElement {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0f1026] px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mb-5 text-sm text-white/75">{message}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
          >
            Try again
          </button>
          <Link
            href="/choose"
            className="inline-flex items-center justify-center rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
          >
            Back to Choose
          </Link>
        </div>
      </div>
    </main>
  );
}
