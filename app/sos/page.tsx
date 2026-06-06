'use client';

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { ChevronLeft, Home } from 'lucide-react';

import { SosBreathRing } from '@/components/features/sos/SosBreathRing';
import { SosCompletionStars } from '@/components/features/sos/SosCompletionStars';
import { SosModeToggle } from '@/components/features/sos/SosModeToggle';
import { GlassActionButton } from '@/components/shared/make-v81/GlassActionButton';
import { GlassIconButton } from '@/components/shared/make-v81/GlassIconButton';
import { GradientTitle } from '@/components/shared/make-v81/GradientTitle';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';
import { useSosBreathEngine } from '@/hooks/useSosBreathEngine';
import { useSosTraceEngine } from '@/hooks/useSosTraceEngine';
import { useTranslation } from '@/i18n/useTranslation';
import { SOS_BREATHS_PER_RING, SOS_TOTAL_CYCLES, type SosMode } from '@/lib/sosBreathing';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const DEFAULT_TUNING = {
  ringDiameterPx: 280,
  strokeWidthPx: 26,
  blurPx: 10,
  glowColor: '#00FFD1',
  blunnoSizePx: 120,
  blunnoOffsetYPx: -6,
  sectionGapPx: 16,
} as const;

export default function SosPage(): ReactElement {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SosMode>('guided');
  const guided = useSosBreathEngine();
  const trace = useSosTraceEngine();
  const traceStartTracked = useRef(false);

  const isGuided = mode === 'guided';
  const session = isGuided ? guided : trace;
  const {
    status,
    cycleIndex,
    breathIndexInCycle,
    phase,
    phaseLabel,
    secondsLeft,
    cycleProgress,
    feedback,
    reset,
    stop,
  } = session;

  // Haptic feedback for breathing phase changes
  useEffect(() => {
    if (status !== 'running') return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(24);
    }
  }, [phase, status]);

  // Haptic feedback for session completion
  useEffect(() => {
    if (status === 'completed') {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 80, 40]);
      }
      trackEvent('sos_session_complete', { mode });
    }
  }, [status, mode]);

  useEffect(() => {
    if (!isGuided && status === 'running' && !traceStartTracked.current) {
      traceStartTracked.current = true;
      trackEvent('sos_session_start', { mode: 'trace' });
    }
    if (status === 'idle') {
      traceStartTracked.current = false;
    }
  }, [status, isGuided]);

  const handleModeChange = (next: SosMode) => {
    if (status !== 'idle') return;
    guided.reset();
    trace.reset();
    setMode(next);
  };

  const handleStart = () => {
    if (isGuided) {
      trackEvent('sos_session_start', { mode: 'guided' });
      void guided.start();
    }
  };

  const handleReset = () => {
    guided.reset();
    trace.reset();
  };

  const handleStop = () => {
    if (status === 'running') {
      trackEvent('sos_session_stop', { mode });
    }
    stop();
  };

  const runningHint = isGuided
    ? t('sos.hint')
    : t('sos.hintTrace');

  const displayPhaseLabel =
    status === 'completed' ? t('sos.complete') : status === 'idle' ? t('sos.ready') : phaseLabel;

  const ringTuning =
    status === 'completed'
      ? { ...DEFAULT_TUNING, blunnoOffsetYPx: -4 }
      : DEFAULT_TUNING;

  return (
    <ScreenFrame className="v81-screen--sos overflow-hidden">
      {status === 'completed' && <SosCompletionStars />}

      <div className="v81-sos-layout relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden">
        <header className="v81-sos-header shrink-0">
          <div className="v81-top-bar v81-sos-top-bar">
            <GlassIconButton href="/choose" icon={ChevronLeft} label={t('nav.back')} />
            <GlassIconButton href="/choose" icon={Home} label={t('nav.exit')} />
          </div>

          <div className="v81-sos-title text-center" data-testid="sos-header">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[15px] font-light italic tracking-wide text-[rgba(196,181,253,0.55)]">
                {t('sos.breatheWith')}
              </span>
              <GradientTitle as="h2" size="sm" className="!text-[28px] !tracking-[0.5px]">
                Blunno
              </GradientTitle>
            </div>
          </div>
        </header>

        {status === 'idle' && (
          <div className="v81-sos-mode-toggle flex shrink-0 justify-center">
            <SosModeToggle mode={mode} onChange={handleModeChange} />
          </div>
        )}

        <div
          className={cn(
            'v81-sos-content flex min-h-0 flex-1 flex-col items-center touch-none select-none',
            status === 'completed' ? 'justify-start pt-1 pb-2' : 'justify-center'
          )}
          aria-label="SOS breathing exercise"
        >
          <div
            className="v81-sos-ring-stack mx-auto flex w-full max-w-sm flex-col items-center"
            style={{ gap: status === 'completed' ? 14 : ringTuning.sectionGapPx }}
          >
            <div className="v81-sos-ring-wrap">
              <SosBreathRing
                mode={mode}
                status={status}
                cycleProgress={cycleProgress}
                tuning={ringTuning}
                onStart={handleStart}
                onTraceBegin={trace.beginPointer}
                onTraceMove={trace.movePointer}
                onTraceEnd={trace.endPointer}
              />
            </div>

            <div className="flex w-full shrink-0 flex-col items-center gap-1 px-1 text-center">
              <p className="text-sm font-medium text-white/80" aria-live="polite" data-testid="sos-phase-label">
                {displayPhaseLabel}
              </p>

              {isGuided && status === 'running' && (
                <p className="text-2xl font-semibold tabular-nums text-white" data-testid="sos-countdown">
                  {secondsLeft}
                </p>
              )}

              {status === 'running' && (
                <p className="text-xs font-medium tracking-wide text-white/55">
                  {t('sos.breathOf', { current: breathIndexInCycle, total: SOS_BREATHS_PER_RING })}
                </p>
              )}

              {status !== 'idle' && (
                <p className="text-sm font-semibold tracking-wide text-white/95">
                  {t('sos.cycleOf', { current: status === 'completed' ? SOS_TOTAL_CYCLES : cycleIndex, total: SOS_TOTAL_CYCLES })}
                </p>
              )}

              <div aria-live="polite" aria-atomic="true">
                {feedback ? (
                  <p className="max-w-sm text-sm font-semibold leading-snug text-white/90">{feedback}</p>
                ) : status === 'idle' ? (
                  <p className="max-w-sm text-xs font-medium leading-snug text-white/60">{t('sos.breath321')}</p>
                ) : status === 'running' ? (
                  <p className="max-w-sm text-xs font-medium leading-snug text-white/60">{runningHint}</p>
                ) : status === 'completed' ? (
                  <p
                    className="max-w-sm text-sm font-semibold leading-snug text-white/90"
                    data-testid="sos-completion-message"
                  >
                    {t('sos.completed')}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="v81-sos-footer mt-auto shrink-0 space-y-3">
          {status === 'completed' ? (
            <>
              <GlassActionButton
                href="/choose"
                borderColor="rgba(255,255,255,0.3)"
                borderGradient="linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 100%)"
                textColor="#FFF"
              >
                {t('sos.complete')}
              </GlassActionButton>
              <GlassActionButton
                onClick={handleReset}
                borderColor="#45A1A1"
                borderGradient="linear-gradient(135deg, #5BB5B5 0%, #45A1A1 50%, #357373 100%)"
                textColor="#6EDAE4"
              >
                {t('sos.stay')}
              </GlassActionButton>
            </>
          ) : status === 'running' ? (
            <GlassActionButton
              onClick={handleStop}
              borderColor="#45A1A1"
              borderGradient="linear-gradient(135deg, #5BB5B5 0%, #45A1A1 50%, #357373 100%)"
              textColor="#6EDAE4"
            >
              {t('sos.stop')}
            </GlassActionButton>
          ) : isGuided ? (
            <GlassActionButton
              onClick={handleStart}
              borderColor="#45A1A1"
              borderGradient="linear-gradient(135deg, #5BB5B5 0%, #45A1A1 50%, #357373 100%)"
              textColor="#6EDAE4"
            >
              {t('sos.start')}
            </GlassActionButton>
          ) : null}
        </div>
      </div>
    </ScreenFrame>
  );
}
