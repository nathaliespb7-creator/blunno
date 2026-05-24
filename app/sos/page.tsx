'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { SosBreathRing } from '@/components/features/sos/SosBreathRing';
import { SosCompletionStars } from '@/components/features/sos/SosCompletionStars';
import { SosModeToggle } from '@/components/features/sos/SosModeToggle';
import { GlassActionButton } from '@/components/shared/make-v81/GlassActionButton';
import { GlassIconButton } from '@/components/shared/make-v81/GlassIconButton';
import { GradientTitle } from '@/components/shared/make-v81/GradientTitle';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';
import { useSosBreathEngine } from '@/hooks/useSosBreathEngine';
import { useSosTraceEngine } from '@/hooks/useSosTraceEngine';
import { SOS_BREATHS_PER_RING, SOS_TOTAL_CYCLES, type SosMode } from '@/lib/sosBreathing';
import { cn } from '@/lib/utils';

const DEFAULT_TUNING = {
  ringDiameterPx: 280,
  strokeWidthPx: 26,
  blurPx: 10,
  glowColor: '#00FFD1',
  blunnoSizePx: 120,
  blunnoOffsetYPx: -6,
  sectionGapPx: 20,
} as const;

export default function SosPage(): ReactElement {
  const router = useRouter();
  const [mode, setMode] = useState<SosMode>('guided');
  const guided = useSosBreathEngine();
  const trace = useSosTraceEngine();

  const isGuided = mode === 'guided';
  const session = isGuided ? guided : trace;
  const {
    status,
    cycleIndex,
    breathIndexInCycle,
    phaseLabel,
    secondsLeft,
    cycleProgress,
    feedback,
    reset,
    stop,
  } = session;

  useEffect(() => {
    document.title = 'SOS - Breathe with Blunno';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Guided or trace 3-2-3 breathing with Blunno');
  }, []);

  const handleModeChange = (next: SosMode) => {
    if (status !== 'idle') return;
    guided.reset();
    trace.reset();
    setMode(next);
  };

  const handleStart = () => {
    if (isGuided) void guided.start();
  };

  const handleReset = () => {
    guided.reset();
    trace.reset();
  };

  const handleStop = () => {
    stop();
  };

  const idleHint = isGuided
    ? 'Tap the ring to begin · 3-2-3 breathing'
    : 'Touch the ring and trace slowly · 3-2-3';

  const runningHint = isGuided
    ? 'Follow the ring and let Blunno guide your breath.'
    : 'Move your finger clockwise around the ring · breathe slowly.';

  return (
    <ScreenFrame className="overflow-hidden">
      {status === 'completed' && <SosCompletionStars />}

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="shrink-0">
          <div className="v81-top-bar">
            <GlassIconButton onClick={() => router.back()} icon={ChevronLeft} label="Back" />
            <GlassIconButton href="/choose" icon={Home} label="Exit to mode selection" />
          </div>

          <div className="mb-3 text-center" data-testid="sos-header">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[17px] font-light italic tracking-wide text-[rgba(196,181,253,0.55)]">breathe with</span>
              <GradientTitle as="h2" size="sm" className="!text-[32px] !tracking-[0.5px]">
                Blunno
              </GradientTitle>
            </div>
          </div>
        </header>

        {status === 'idle' && (
          <div className="mb-3 flex shrink-0 justify-center">
            <SosModeToggle mode={mode} onChange={handleModeChange} />
          </div>
        )}

        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col items-center touch-none select-none',
            status === 'completed' ? 'justify-start pt-2 pb-4' : 'justify-center'
          )}
          aria-label="SOS breathing exercise"
        >
          <div
            className="mx-auto flex w-full max-w-sm flex-col items-center"
            style={{ gap: status === 'completed' ? 16 : DEFAULT_TUNING.sectionGapPx }}
          >
            <SosBreathRing
              mode={mode}
              status={status}
              cycleProgress={cycleProgress}
              tuning={
                status === 'completed'
                  ? { ...DEFAULT_TUNING, ringDiameterPx: 260, blunnoSizePx: 112 }
                  : DEFAULT_TUNING
              }
              onStart={handleStart}
              onTraceBegin={trace.beginPointer}
              onTraceMove={trace.movePointer}
              onTraceEnd={trace.endPointer}
            />

            <div className="flex w-full shrink-0 flex-col items-center gap-1 px-1 text-center">
              <p className="text-sm font-medium text-white/80" aria-live="polite" data-testid="sos-phase-label">
                {status === 'completed' ? 'Complete' : phaseLabel}
              </p>

              {isGuided && status === 'running' && (
                <p className="text-2xl font-semibold tabular-nums text-white" data-testid="sos-countdown">
                  {secondsLeft}
                </p>
              )}

              {status === 'running' && (
                <p className="text-xs font-medium tracking-wide text-white/55">
                  Breath {breathIndexInCycle} of {SOS_BREATHS_PER_RING}
                </p>
              )}

              <p className="text-sm font-semibold tracking-wide text-white/95">
                Cycle {status === 'completed' ? SOS_TOTAL_CYCLES : cycleIndex} of {SOS_TOTAL_CYCLES}
              </p>

              <div aria-live="polite" aria-atomic="true">
                {feedback ? (
                  <p className="max-w-sm text-sm font-semibold leading-snug text-white/90">{feedback}</p>
                ) : status === 'idle' ? (
                  <p className="max-w-sm text-xs font-medium leading-snug text-white/60">{idleHint}</p>
                ) : status === 'running' ? (
                  <p className="max-w-sm text-xs font-medium leading-snug text-white/60">{runningHint}</p>
                ) : status === 'completed' ? (
                  <p className="max-w-sm text-sm font-semibold leading-snug text-white/90" data-testid="sos-completion-message">
                    You did it. Breathe easy.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto shrink-0 space-y-3 border-t border-white/5 bg-[#0C0A1A]/80 pt-4 backdrop-blur-md">
          {status === 'completed' ? (
            <>
              <GlassActionButton
                href="/choose"
                borderColor="rgba(255,255,255,0.3)"
                borderGradient="linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)"
                textColor="#FFF"
              >
                Complete
              </GlassActionButton>
              <GlassActionButton
                onClick={handleReset}
                borderColor="#45A1A1"
                borderGradient="linear-gradient(135deg, #5BB5B5 0%, #45A1A1 50%, #357373 100%)"
                textColor="#6EDAE4"
              >
                Stay
              </GlassActionButton>
            </>
          ) : status === 'running' ? (
            <GlassActionButton
              onClick={handleStop}
              borderColor="#45A1A1"
              borderGradient="linear-gradient(135deg, #5BB5B5 0%, #45A1A1 50%, #357373 100%)"
              textColor="#6EDAE4"
            >
              Stop
            </GlassActionButton>
          ) : isGuided ? (
            <GlassActionButton
              onClick={handleStart}
              borderColor="#45A1A1"
              borderGradient="linear-gradient(135deg, #5BB5B5 0%, #45A1A1 50%, #357373 100%)"
              textColor="#6EDAE4"
            >
              Start breathing
            </GlassActionButton>
          ) : null}
        </div>
      </div>
    </ScreenFrame>
  );
}
