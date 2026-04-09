'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const TopNav = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 border-b border-black/40 bg-blunno-bg/85 shadow-screen backdrop-blur-md">
      <div
        className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4 pb-3"
        style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90 transition-colors hover:border-white/25 hover:text-white"
        >
          Back
        </button>

        <div className="text-sm font-bold tracking-wide text-white">{title}</div>

        <Link
          href="/choose"
          aria-label="Home"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#1a1a2e]/90 text-white/95 shadow-md backdrop-blur-sm"
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
