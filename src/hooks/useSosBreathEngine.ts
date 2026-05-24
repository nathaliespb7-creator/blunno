'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

function cycleFeedbackMessage(completedCycle: number): string {
  if (completedCycle === 1) return 'Nice! Cycle 1 of 3';
  if (completedCycle === 2) return 'Great! Cycle 2 of 3';
  return "Last round! You've got this.";
}

const initialState: SosBreathEngineState = {
  status: 'idle',
  cycleIndex: 1,
  breathIndexInCycle: 1,
  phase: 'inhale',
  phaseLabel: 'Inhale',
  secondsLeft: SOS_PHASES[0].seconds,
  phaseProgress: 0,
  cycleProgress: 0,
  feedback: '',
};

export function useSosBreathEngine() {
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
        phaseLabel: 'Complete',
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
      phaseLabel: SOS_PHASES[phaseIndex].label,
      secondsLeft,
      phaseProgress,
      cycleProgress: ringProgressFromElapsed(cycleElapsed),
      feedback,
      breathIndexInCycle,
    });

    rafRef.current = requestAnimationFrame(tickFrame);
  }, [cancelLoop]);

  const start = useCallback(async () => {
    cancelLoop();
    lastCompletedCyclesRef.current = 0;
    startedAtRef.current = performance.now();
    setState({
      ...initialState,
      status: 'running',
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [cancelLoop, tick]);

  const reset = useCallback(() => {
    cancelLoop();
    startedAtRef.current = null;
    lastCompletedCyclesRef.current = 0;
    setState(initialState);
  }, [cancelLoop]);

  const stop = useCallback(() => {
    reset();
  }, [reset]);

  useEffect(() => cancelLoop, [cancelLoop]);

  return { ...state, start, reset, stop };
}
