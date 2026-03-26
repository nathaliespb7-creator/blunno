'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const TopNav = ({ title }: { title: string }) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-[#120a2d]/60 backdrop-blur-md">
      <div
        className="mx-auto flex h-16 w-full max-w-md items-center justify-between px-4 pb-3"
        style={{ paddingTop: 'max(24px, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:border-white/20 transition-colors"
        >
          Back
        </button>

        <div className="text-sm font-medium text-white/90">{title}</div>

        <Link
          href="/choose"
          aria-label="Home"
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition-colors hover:border-white/20 hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5.25 9.75V21h13.5V9.75" />
            <path d="M10 21v-6h4v6" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

