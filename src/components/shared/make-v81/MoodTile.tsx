'use client';

import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';

import { GlassListCell } from '@/components/shared/make-v81/GlassListCell';

export type MoodTileConfig = {
  id: string;
  label: string;
  description: string;
  borderColor: string;
  borderGradient: string;
};

type MoodTileProps = {
  mood: MoodTileConfig;
  href: string;
  onNavigate?: () => void;
};

export function MoodTile({ mood, href, onNavigate }: MoodTileProps): ReactElement {
  const router = useRouter();

  const handleClick = () => {
    onNavigate?.();
    router.push(href);
  };

  return (
    <GlassListCell
      as="button"
      onClick={handleClick}
      accentColor={mood.borderColor}
      title={mood.label}
      subtitle={mood.description}
      subtitleVariant="description"
      aria-label={mood.label}
      className="[&_.v81-glass-cell-title]:uppercase [&_.v81-glass-cell-title]:tracking-wide"
    />
  );
}
