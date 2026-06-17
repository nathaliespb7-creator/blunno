'use client';

import { useRouter } from 'next/navigation';

import { GlassCellDecor } from '@/components/shared/make-v81/GlassCellDecor';
import { useTranslation } from '@/i18n/useTranslation';
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
  label,
  onNavigate,
  analyticsEvent,
  className,
}: WelcomeCTAProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const displayLabel = label ?? t('nav.start');

  const handleClick = () => {
    if (analyticsEvent) trackEvent(analyticsEvent);
    onNavigate?.();
    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn('welcome-cta group border-none bg-transparent p-0', className)}
    >
      <GlassCellDecor />
      <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{displayLabel}</span>
    </button>
  );
}
