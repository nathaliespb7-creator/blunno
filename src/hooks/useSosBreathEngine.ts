'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import {
  SOS_CYCLE_MS,
  SOS_PHASES,
  SOS_TOTAL_CYCLES,
  phaseAtElapsed,
  ringProgressFromElapsed,
  type SosBreathPhaseId,
  type SosBreathStatus,
} from '@/lib/sosBreathing';

export type { SosBreathStatus };

export type SosBreathEngineState = {
  status: SosBreathStatus;
  cycleIndex: number;
  breathIndexInCycle: number;
  phase: SosBreathPhaseId;
  phaseLabel: string;
  secondsLeft: number;
  phaseProgress: number;
  cycleProgress: number;
  feedback: string;
};

export function useSosBreathEngine() {
  const { t } = useTranslation();

  const initialState: SosBreathEngineState = useMemo(() => ({
    status: 'idle' as SosBreathStatus,
    cycleIndex: 1,
    breathIndexInCycle: 1,
    phase: 'inhale' as SosBreathPhaseId,
    phaseLabel: t('sos.inhale'),
    secondsLeft: SOS_PHASES[0].seconds,
    phaseProgress: 0,
    cycleProgress: 0,
    feedback: '',
  }), [t]);

  const [state, setState] = useState<SosBreathEngineState>(initialState);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const lastCompletedCyclesRef = useRef(0);

  const cancelLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  function cycleFeedbackMessage(completedCycle: number): string {
    if (completedCycle === 1) return t('sos.feedbackCycle1');
    if (completedCycle === 2) return t('sos.feedbackCycle2');
    return t('sos.feedbackCycle3');
  }

  const tick = useCallback(function tickFrame() {
    const startedAt = startedAtRef.current;
    if (startedAt === null) return;

    const totalElapsed = performance.now() - startedAt;
    const completedCycles = Math.floor(totalElapsed / SOS_CYCLE_MS);

    if (completedCycles >= SOS_TOTAL_CYCLES) {
      startedAtRef.current = null;
      cancelLoop();
      setState({
        status: 'completed',
        cycleIndex: SOS_TOTAL_CYCLES,
        breathIndexInCycle: 2,
        phase: 'exhale',
        phaseLabel: t('sos.complete'),
        secondsLeft: 0,
        phaseProgress: 1,
        cycleProgress: 1,
        feedback: '',
      });
      return;
    }

    const cycleElapsed = totalElapsed - completedCycles * SOS_CYCLE_MS;
    const { phase, phaseIndex, phaseProgress, secondsLeft, breathIndexInCycle } = phaseAtElapsed(cycleElapsed);

    let feedback = '';
    if (completedCycles > lastCompletedCyclesRef.current && completedCycles < SOS_TOTAL_CYCLES) {
      feedback = cycleFeedbackMessage(completedCycles);
      lastCompletedCyclesRef.current = completedCycles;
    }

    setState({
      status: 'running',
      cycleIndex: completedCycles + 1,
      phase,
      phaseLabel: t(SOS_PHASES[phaseIndex].label),
      secondsLeft,
      phaseProgress,
      cycleProgress: ringProgressFromElapsed(cycleElapsed),
      feedback,
      breathIndexInCycle,
    });

    rafRef.current = requestAnimationFrame(tickFrame);
  }, [cancelLoop, t]);

  const start = useCallback(async () => {
    cancelLoop();
    lastCompletedCyclesRef.current = 0;
    startedAtRef.current = performance.now();
    setState({
      ...initialState,
      status: 'running',
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelLoop, tick, initialState]);

  const reset = useCallback(() => {
    cancelLoop();
    startedAtRef.current = null;
    lastCompletedCyclesRef.current = 0;
    setState(initialState);
  }, [cancelLoop, initialState]);

  const stop = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => cancelLoop, [cancelLoop]);

  return { ...state, start, reset, stop };
}
