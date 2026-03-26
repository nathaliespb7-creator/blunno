import Link from 'next/link';

const Card = ({
  title,
  subtitle,
  href,
  accent,
}: {
  title: string;
  subtitle: string;
  href: string;
  accent: string;
}) => {
  return (
    <Link
      href={href}
      className={[
        'group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-md p-6',
        'shadow-lg transition-transform active:scale-[0.99] hover:scale-[1.01]',
      ].join(' ')}
    >
      <div
        className="absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-70 transition-opacity group-hover:opacity-90"
        style={{ background: accent }}
      />
      <div className="relative">
        <div className="text-sm text-white/70">{subtitle}</div>
        <div className="mt-2 text-2xl font-semibold text-white">{title}</div>
      </div>
    </Link>
  );
};

export default function ChoosePage() {
  return (
    <main
      className="min-h-screen bg-gradient-to-b from-[#1a1040] to-[#0d0820] px-6 pb-10 text-white"
      style={{ paddingTop: 'max(36px, calc(env(safe-area-inset-top) + 28px))' }}
    >
      <div className="mx-auto w-full max-w-md">
        <div className="flex justify-end">
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

        <div className="mt-8 grid gap-4">
          <Card title="SOS" subtitle="When you need help right now" href="/sos" accent="rgba(255, 120, 120, 0.55)" />
          <Card title="Planner" subtitle="Daily plan and focused time" href="/planner" accent="rgba(130, 180, 255, 0.55)" />
          <Card title="Games" subtitle="Switch gears and exhale" href="/play" accent="rgba(189, 178, 255, 0.55)" />
        </div>
      </div>
    </main>
  );
}

