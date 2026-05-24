export const SOS_SCALE_MIN = 0.85;
export const SOS_SCALE_MAX = 1.15;

/** One mini breath: inhale 3s, hold 2s, exhale 3s. */
export const SOS_PHASES = [
  { id: 'inhale' as const, label: 'Inhale', seconds: 3 },
  { id: 'hold' as const, label: 'Hold', seconds: 2 },
  { id: 'exhale' as const, label: 'Exhale', seconds: 3 },
] as const;

export const SOS_BREATHS_PER_RING = 2;
export const SOS_MINI_CYCLE_MS = SOS_PHASES.reduce((sum, p) => sum + p.seconds, 0) * 1000;
export const SOS_TOTAL_CYCLES = 3;
export const SOS_CYCLE_MS = SOS_MINI_CYCLE_MS * SOS_BREATHS_PER_RING;

const MINI_INHALE_END = SOS_PHASES[0].seconds / (SOS_MINI_CYCLE_MS / 1000);
const MINI_HOLD_END = (SOS_PHASES[0].seconds + SOS_PHASES[1].seconds) / (SOS_MINI_CYCLE_MS / 1000);

export type SosBreathPhaseId = (typeof SOS_PHASES)[number]['id'];

export type SosBreathStatus = 'idle' | 'running' | 'completed';

export type SosMode = 'guided' | 'trace';

function scaleFromMiniProgress(miniP: number): number {
  const clamped = Math.max(0, Math.min(1, miniP));
  if (clamped <= MINI_INHALE_END) {
    const t = MINI_INHALE_END > 0 ? clamped / MINI_INHALE_END : 0;
    return SOS_SCALE_MIN + t * (SOS_SCALE_MAX - SOS_SCALE_MIN);
  }
  if (clamped <= MINI_HOLD_END) return SOS_SCALE_MAX;
  const exhaleSpan = 1 - MINI_HOLD_END;
  const t = exhaleSpan > 0 ? (clamped - MINI_HOLD_END) / exhaleSpan : 0;
  return SOS_SCALE_MAX - t * (SOS_SCALE_MAX - SOS_SCALE_MIN);
}

/** Ring fill 0–1 from elapsed time within one full ring (2 × 3-2-3 breaths). */
export function ringProgressFromElapsed(elapsedMs: number, cycleMs: number = SOS_CYCLE_MS): number {
  if (cycleMs <= 0) return 0;
  return Math.max(0, Math.min(1, elapsedMs / cycleMs));
}

/** Mascot scale: two 3-2-3 breaths per ring (each half of the ring). */
export function scaleFromTimedCycleProgress(p: number): number {
  const clamped = Math.max(0, Math.min(1, p));
  const localP = (clamped * SOS_BREATHS_PER_RING) % 1;
  return scaleFromMiniProgress(localP);
}

/** @deprecated Use scaleFromTimedCycleProgress for guided mode. */
export function scaleFromCycleProgress(p: number): number {
  return scaleFromTimedCycleProgress(p);
}

export function mascotSizePx(ringDiameterPx: number, strokeWidthPx: number, blunnoSizePx: number): number {
  const innerRingPx = ringDiameterPx - strokeWidthPx * 2;
  return Math.min(blunnoSizePx, innerRingPx * 0.48);
}

/** Glow intensity 0–1 from scale (brighter on inhale). */
export function glowIntensityFromScale(scale: number): number {
  const range = SOS_SCALE_MAX - SOS_SCALE_MIN;
  if (range <= 0) return 0.5;
  return Math.max(0, Math.min(1, (scale - SOS_SCALE_MIN) / range));
}

function phaseAtMiniElapsed(elapsedMs: number): {
  phase: SosBreathPhaseId;
  phaseIndex: number;
  phaseProgress: number;
  secondsLeft: number;
} {
  let remaining = Math.max(0, elapsedMs);
  for (let i = 0; i < SOS_PHASES.length; i += 1) {
    const phaseMs = SOS_PHASES[i].seconds * 1000;
    if (remaining < phaseMs) {
      return {
        phase: SOS_PHASES[i].id,
        phaseIndex: i,
        phaseProgress: phaseMs > 0 ? remaining / phaseMs : 0,
        secondsLeft: Math.ceil((phaseMs - remaining) / 1000),
      };
    }
    remaining -= phaseMs;
  }
  const last = SOS_PHASES[SOS_PHASES.length - 1];
  return {
    phase: last.id,
    phaseIndex: SOS_PHASES.length - 1,
    phaseProgress: 1,
    secondsLeft: 0,
  };
}

export function phaseAtElapsed(elapsedMs: number): {
  phase: SosBreathPhaseId;
  phaseIndex: number;
  phaseProgress: number;
  secondsLeft: number;
  breathIndexInCycle: number;
} {
  const miniElapsed = elapsedMs % SOS_MINI_CYCLE_MS;
  const breathIndexInCycle = Math.floor(elapsedMs / SOS_MINI_CYCLE_MS) + 1;
  return {
    ...phaseAtMiniElapsed(miniElapsed),
    breathIndexInCycle: Math.min(breathIndexInCycle, SOS_BREATHS_PER_RING),
  };
}

/** Phase from ring fill progress (trace mode). */
export function phaseAtProgress(cycleProgress: number): {
  phase: SosBreathPhaseId;
  phaseIndex: number;
  phaseProgress: number;
  breathIndexInCycle: number;
} {
  const clamped = Math.max(0, Math.min(1, cycleProgress));
  const miniP = (clamped * SOS_BREATHS_PER_RING) % 1;
  const breathIndexInCycle = Math.min(
    SOS_BREATHS_PER_RING,
    Math.floor(clamped * SOS_BREATHS_PER_RING) + 1
  );

  if (miniP <= MINI_INHALE_END) {
    return {
      phase: SOS_PHASES[0].id,
      phaseIndex: 0,
      phaseProgress: MINI_INHALE_END > 0 ? miniP / MINI_INHALE_END : 0,
      breathIndexInCycle,
    };
  }
  if (miniP <= MINI_HOLD_END) {
    const span = MINI_HOLD_END - MINI_INHALE_END;
    return {
      phase: SOS_PHASES[1].id,
      phaseIndex: 1,
      phaseProgress: span > 0 ? (miniP - MINI_INHALE_END) / span : 0,
      breathIndexInCycle,
    };
  }
  const span = 1 - MINI_HOLD_END;
  return {
    phase: SOS_PHASES[2].id,
    phaseIndex: 2,
    phaseProgress: span > 0 ? (miniP - MINI_HOLD_END) / span : 0,
    breathIndexInCycle,
  };
}
