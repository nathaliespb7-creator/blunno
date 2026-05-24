'use client';

import { ChevronLeft, Home } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { GlassIconButton } from '@/components/shared/make-v81/GlassIconButton';
import { GradientTitle } from '@/components/shared/make-v81/GradientTitle';

type ModeScreenTopBarProps = {
  title: ReactNode;
  backHref?: string;
  backLabel: string;
  onBack?: () => void;
  homeHref: string;
  homeLabel: string;
};

export function ModeScreenTopBar({
  title,
  backHref,
  backLabel,
  onBack,
  homeHref,
  homeLabel,
}: ModeScreenTopBarProps): ReactElement {
  return (
    <div className="v81-top-bar">
      {onBack ? (
        <GlassIconButton icon={ChevronLeft} label={backLabel} onClick={onBack} />
      ) : (
        <GlassIconButton href={backHref ?? '/'} icon={ChevronLeft} label={backLabel} />
      )}
      <GradientTitle as="h1" size="md">
        {title}
      </GradientTitle>
      <GlassIconButton href={homeHref} icon={Home} label={homeLabel} />
    </div>
  );
}
