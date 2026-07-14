'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import {
  SOS_BREATHS_PER_RING,
  SOS_PHASES,
  SOS_TOTAL_CYCLES,
  phaseAtProgress,
  type SosBreathPhaseId,
  type SosBreathStatus,
} from '@/lib/sosBreathing';
import { clockwiseProgressDelta, progressFromClientPoint } from '@/lib/sosRingGeometry';

export type SosTraceEngineState = {
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

export function useSosTraceEngine() {
  const { t } = useTranslation();

  const initialState: SosTraceEngineState = useMemo(() => ({
    status: 'idle' as SosBreathStatus,
    cycleIndex: 1,
    breathIndexInCycle: 1,
    phase: 'inhale' as SosBreathPhaseId,
    phaseLabel: t('sos.inhale'),
    secondsLeft: 0,
    phaseProgress: 0,
    cycleProgress: 0,
    feedback: '',
  }), [t]);

  const [state, setState] = useState<SosTraceEngineState>(initialState);
  const totalProgressRef = useRef(0);
  const lastSampleRef = useRef<number | null>(null);
  const lastCompletedCyclesRef = useRef(0);
  const statusRef = useRef<SosBreathStatus>('idle');
  const isTracingRef = useRef(false);

  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);

  const cycleFeedbackMessage = useCallback((completedCycle: number): string => {
    if (completedCycle === 1) return t('sos.feedbackCycle1');
    if (completedCycle === 2) return t('sos.feedbackCycle2');
    return t('sos.feedbackCycle3');
  }, [t]);

  const applyTotalProgress = useCallback((total: number) => {
    const completedCycles = Math.floor(total);

    if (completedCycles >= SOS_TOTAL_CYCLES) {
      totalProgressRef.current = SOS_TOTAL_CYCLES;
      isTracingRef.current = false;
      setState({
        status: 'completed',
        cycleIndex: SOS_TOTAL_CYCLES,
        breathIndexInCycle: SOS_BREATHS_PER_RING,
        phase: 'exhale',
        phaseLabel: t('sos.complete'),
        secondsLeft: 0,
        phaseProgress: 1,
        cycleProgress: 1,
        feedback: '',
      });
      return;
    }

    const cycleProgress = total - completedCycles;
    const { phase, phaseIndex, phaseProgress, breathIndexInCycle } = phaseAtProgress(cycleProgress);

    let feedback = '';
    if (completedCycles > lastCompletedCyclesRef.current && completedCycles < SOS_TOTAL_CYCLES) {
      feedback = cycleFeedbackMessage(completedCycles);
      lastCompletedCyclesRef.current = completedCycles;
    }

    setState({
      status: 'running',
      cycleIndex: completedCycles + 1,
      breathIndexInCycle,
      phase,
      phaseLabel: t(SOS_PHASES[phaseIndex].label),
      secondsLeft: 0,
      phaseProgress,
      cycleProgress,
      feedback,
    });
  }, [cycleFeedbackMessage, t]);

  const beginPointer = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (statusRef.current === 'completed') return;

      if (statusRef.current === 'idle') {
        totalProgressRef.current = 0;
        lastCompletedCyclesRef.current = 0;
        applyTotalProgress(0);
      }

      isTracingRef.current = true;
      lastSampleRef.current = progressFromClientPoint(clientX, clientY, rect);
    },
    [applyTotalProgress]
  );

  const movePointer = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (!isTracingRef.current || statusRef.current === 'completed') return;

      const sample = progressFromClientPoint(clientX, clientY, rect);
      const last = lastSampleRef.current;
      if (last === null) {
        lastSampleRef.current = sample;
        return;
      }

      const delta = clockwiseProgressDelta(last, sample);
      if (delta > 0) {
        totalProgressRef.current += delta;
        applyTotalProgress(totalProgressRef.current);
      }
      lastSampleRef.current = sample;
    },
    [applyTotalProgress]
  );

  const endPointer = useCallback(() => {
    lastSampleRef.current = null;
    isTracingRef.current = false;
  }, []);

  const reset = useCallback(() => {
    totalProgressRef.current = 0;
    lastSampleRef.current = null;
    lastCompletedCyclesRef.current = 0;
    isTracingRef.current = false;
    setState(initialState);
  }, [initialState]);

  const stop = useCallback(() => {
    reset();
  }, [reset]);

  return {
    ...state,
    beginPointer,
    movePointer,
    endPointer,
    reset,
    stop,
  };
}
