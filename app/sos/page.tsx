import Link from 'next/link';

import { SOSModule } from '@/components/features/sos/SOSModule';

export default function SosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a1040] to-[#0d0820] text-white overflow-x-hidden">
      <div
        className="mx-auto flex w-full max-w-md justify-end px-4 pb-3"
        style={{ paddingTop: 'max(36px, calc(env(safe-area-inset-top) + 28px))' }}
      >
        <Link
          href="/"
          aria-label="Exit to welcome screen"
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition-colors hover:border-white/20 hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="3" width="11" height="18" rx="2" />
            <path d="M15 12h5" />
            <path d="M18 9l3 3-3 3" />
          </svg>
        </Link>
      </div>
      <SOSModule />
    </main>
  );
}

