'use client';

import type { ReactElement } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import type { SosMode } from '@/lib/sosBreathing';
import { cn } from '@/lib/utils';

type SosModeToggleProps = {
  mode: SosMode;
  onChange: (mode: SosMode) => void;
};

const OPTIONS: { id: SosMode; labelKey: string }[] = [
  { id: 'guided', labelKey: 'sos.guided' },
  { id: 'trace', labelKey: 'sos.trace' },
];

export function SosModeToggle({ mode, onChange }: SosModeToggleProps): ReactElement {
  const { t } = useTranslation();
  return (
    <div
      className="flex w-full max-w-[240px] rounded-full border border-white/10 bg-white/[0.04] p-1"
      role="tablist"
      aria-label={t('sos.breathingMode')}
      data-testid="sos-mode-toggle"
    >
      {OPTIONS.map((option) => {
        const selected = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            data-testid={`sos-mode-${option.id}`}
            className={cn(
              'blunno-focus-visible flex-1 rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition-colors',
              selected
                ? 'bg-white/12 text-white shadow-[0_0_12px_rgba(0,255,209,0.15)]'
                : 'text-white/50 hover:text-white/70'
            )}
            onClick={() => onChange(option.id)}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
