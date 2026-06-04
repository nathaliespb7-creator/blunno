import Link from 'next/link';
import type { ReactElement } from 'react';

import { routeMetadata } from '@/lib/seo';

export const metadata = routeMetadata({
  path: '/privacy',
  title: 'Privacy',
  description:
    'How Blunno handles data: offline-first PWA, optional analytics, no account required.',
});

export default function PrivacyPage(): ReactElement {
  return (
    <main className="min-h-dvh bg-[#05050A] font-sans text-white/90 px-6 py-10">
      <div className="mx-auto max-w-lg space-y-6">
        <Link href="/" className="text-sm text-[#00FFFF] hover:underline">
          ← Back to Blunno
        </Link>

        <h1 className="text-2xl font-semibold text-white">Privacy</h1>
        <p className="text-sm text-[#9CA3AF]">Last updated: June 2026</p>

        <section className="space-y-3 text-sm leading-relaxed text-[#9CA3AF]">
          <h2 className="text-base font-semibold text-white">What we collect</h2>
          <p>
            Blunno works without an account. Planner tasks and preferences stay on your device
            (browser storage). We do not sell your data.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-[#9CA3AF]">
          <h2 className="text-base font-semibold text-white">Analytics (optional)</h2>
          <p>
            If you accept cookies on the site, we use Google Analytics (GA4) to understand which
            features help students — for example opening SOS, Relax, or Play. You can decline
            analytics and still use the app fully.
          </p>
          <p>
            Measurement ID: <span className="text-white/70">G-QH796CJ4ZX</span>. Google may process
            data according to their{' '}
            <a
              href="https://policies.google.com/privacy"
              className="text-[#00FFFF] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-[#9CA3AF]">
          <h2 className="text-base font-semibold text-white">Offline &amp; PWA</h2>
          <p>
            Relax sounds and core pages can be cached for offline use via a service worker. No
            personal data is sent when you are offline.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-[#9CA3AF]">
          <h2 className="text-base font-semibold text-white">Contact</h2>
          <p>
            Questions or deletion requests:{' '}
            <a href="mailto:hello@blunno.app" className="text-[#00FFFF] hover:underline">
              hello@blunno.app
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
