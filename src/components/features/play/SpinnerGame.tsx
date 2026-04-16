'use client';

import { FidgetSpinner } from 'react-fidget-spinner';
import type { ReactElement } from 'react';

/**
 * Blunno-style face inside the fidget spinner (gradient blob, no store coupling).
 */
function BlunnoSpinnerFace(): ReactElement {
  return (
    <div
      className="flex aspect-square w-full max-w-[300px] items-center justify-center rounded-full border-2 border-white/25 shadow-[inset_0_2px_12px_rgba(0,0,0,0.35)]"
      style={{
        background:
          'radial-gradient(circle at 35% 30%, rgba(110,218,228,0.45) 0%, rgba(167,139,250,0.5) 42%, rgba(44,25,72,0.98) 100%)',
      }}
    >
      <div className="h-[42%] w-[42%] rounded-full bg-gradient-to-br from-[#6EDAE4] via-[#BDB2FF] to-[#A78BFA] opacity-95 shadow-lg ring-2 ring-white/20" />
    </div>
  );
}

export function SpinnerGame(): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-6 bg-[#0D0524] px-2 py-4">
      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <p className="max-w-md text-center text-sm font-medium leading-relaxed text-white/90 sm:text-base">
          Drag the spinner to rotate and calm your focus.
        </p>
        <div
          className="flex w-full touch-none items-center justify-center select-none"
          style={{ width: 'min(80vw, 300px)', height: 'auto' }}
        >
          <FidgetSpinner
            bubbleConfig={{ active: false, components: [] }}
            sparkConfig={{ active: false, components: [] }}
            spinnerConfig={{
              dampingCoefficient: 0.985,
              maxAngularVelocity: 80,
            }}
          >
            <BlunnoSpinnerFace />
          </FidgetSpinner>
        </div>
      </div>
    </div>
  );
}
