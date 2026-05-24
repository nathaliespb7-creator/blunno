'use client';

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
  delayIndex?: number;
};

export function MoodTile({ mood, href, onNavigate, delayIndex = 0 }: MoodTileProps): ReactElement {
  return (
    <GlassListCell
      as="a"
      href={href}
      accentColor={mood.borderColor}
      title={mood.label}
      subtitle={mood.description}
      subtitleVariant="description"
      onClick={onNavigate}
      aria-label={mood.label}
      animationDelay={`${0.3 + delayIndex * 0.1}s`}
      className="[&_.v81-glass-cell-title]:uppercase [&_.v81-glass-cell-title]:tracking-wide"
    />
  );
}
