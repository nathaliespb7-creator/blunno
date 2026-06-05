import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Page not found – Blunno',
  description: 'The page you are looking for doesn\'t exist.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/404` },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-welcome-display text-6xl font-bold text-white/90">404</h1>
      <p className="mt-4 text-lg text-white/60">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-cyan-400/90 to-fuchsia-600/90 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        Go home
      </Link>
    </main>
  );
}
