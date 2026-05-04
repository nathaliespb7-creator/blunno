'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

export const TopNav = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-blunno-bg/90 shadow-screen backdrop-blur-md">
      <div
        className="mx-auto flex min-h-16 w-full max-w-md items-center justify-between gap-2 px-4 pb-3"
        style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="blunno-focus-visible min-h-11 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-[0.98] motion-reduce:active:scale-100"
        >
          Back
        </button>

        <div className="truncate text-center text-sm font-bold tracking-wide text-white">{title}</div>

        <Link
          href="/choose"
          aria-label="Home"
          className={cn('blunno-focus-visible blunno-nav-btn shrink-0 text-white/95')}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
