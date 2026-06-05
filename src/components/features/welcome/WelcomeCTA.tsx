'use client';

import Link from 'next/link';
import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type WelcomeCTAProps = {
  href: string;
  label?: string;
  onNavigate?: () => void;
  analyticsEvent?: AnalyticsEventName;
  className?: string;
};

export function WelcomeCTA({
  href,
  label = 'Start Now',
  onNavigate,
  analyticsEvent,
  className,
}: WelcomeCTAProps) {
  const handleClick = () => {
    if (analyticsEvent) trackEvent(analyticsEvent);
    onNavigate?.();
  };

  return (
    <Link href={href} prefetch onClick={handleClick} className={cn('welcome-cta group', className)}>
      <GlassCellDecor />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{label}</span>
    </Link>
  );
}
