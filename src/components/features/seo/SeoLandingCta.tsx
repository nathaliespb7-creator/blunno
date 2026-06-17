'use client';

import { useRouter } from 'next/navigation';

type SeoLandingCtaProps = {
  href: string;
  label: string;
};

export function SeoLandingCta({ href, label }: SeoLandingCtaProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="welcome-btn-primary w-full max-w-sm border-none text-center"
    >
      {label}
    </button>
  );
}
