'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { audioService } from '@/services/audioService';

type SpinnerPhase = 'intro' | 'running' | 'completed' | 'distracted';

const SESSION_DURATION_MS = 2 * 60 * 1000;
const MEANINGFUL_DELTA_DEG = 0.8;
const ATTENTION_DECAY_PER_SEC = 0.12;
const ATTENTION_IDLE_GRACE_MS = 900;

function angleFromPointer(clientX: number, clientY: number, rect: DOMRect): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function SpinnerGame(): ReactElement {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const lastMeaningfulInteractionAtRef = useRef<number>(Date.now());
  const prevPhaseRef = useRef<SpinnerPhase>('intro');

  const [rotation, setRotation] = useState(0);
  const [lastAngle, setLastAngle] = useState<number | null>(null);

  const [phase, setPhase] = useState<SpinnerPhase>('intro');
  const [timeRemainingMs, setTimeRemainingMs] = useState(SESSION_DURATION_MS);
  const [attention, setAttention] = useState(1);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastAngle(angleFromPointer(e.clientX, e.clientY, rect));
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (lastAngle === null || !wheelRef.current) return;
      const rect = wheelRef.current.getBoundingClientRect();
      const current = angleFromPointer(e.clientX, e.clientY, rect);
      let delta = current - lastAngle;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      setRotation((r) => r + delta);
      setLastAngle(current);

      if (phase !== 'running') return;
      const absDelta = Math.abs(delta);
      if (absDelta < MEANINGFUL_DELTA_DEG) return;

      lastMeaningfulInteractionAtRef.current = Date.now();
      const boost = Math.min(0.22, 0.08 + absDelta * 0.004);
      setAttention((prev) => Math.min(1, prev + boost));
    },
    [lastAngle, phase]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setLastAngle(null);
  }, []);

  const startSession = useCallback(async () => {
    await audioService.ensureUnlocked();
    setTimeRemainingMs(SESSION_DURATION_MS);
    setAttention(1);
    setPhase('running');
    lastMeaningfulInteractionAtRef.current = Date.now();
    lastTickRef.current = null;
  }, []);

  const restartSession = useCallback(() => {
    setTimeRemainingMs(SESSION_DURATION_MS);
    setAttention(1);
    setPhase('running');
    lastMeaningfulInteractionAtRef.current = Date.now();
    lastTickRef.current = null;
  }, []);

  useEffect(() => {
    if (phase !== 'running') {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTickRef.current = null;
      return;
    }

    const tick = (ts: number) => {
      const last = lastTickRef.current ?? ts;
      const dtSeconds = Math.max(0, (ts - last) / 1000);
      lastTickRef.current = ts;

      setTimeRemainingMs((prev) => Math.max(0, prev - dtSeconds * 1000));

      const idleMs = Date.now() - lastMeaningfulInteractionAtRef.current;
      setAttention((prev) => {
        if (idleMs <= ATTENTION_IDLE_GRACE_MS) return Math.min(1, prev + dtSeconds * 0.025);
        return Math.max(0, prev - dtSeconds * ATTENTION_DECAY_PER_SEC);
      });

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTickRef.current = null;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    if (attention <= 0) {
      setPhase('distracted');
      return;
    }
    if (timeRemainingMs <= 0) {
      setPhase('completed');
    }
  }, [phase, attention, timeRemainingMs]);

  useEffect(() => {
    const prev = prevPhaseRef.current;
    if (phase === prev) return;

    if (phase === 'completed') {
      void audioService.play('success');
    }
    if (phase === 'distracted') {
      void audioService.play('hover-soft');
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const phaseTitle = useMemo(() => {
    if (phase === 'running') return 'Keep focus on spinner';
    if (phase === 'completed') return 'Great focus session';
    if (phase === 'distracted') return 'Focus slipped';
    return 'Spinner focus mode';
  }, [phase]);

  const phaseHint = useMemo(() => {
    if (phase === 'running') return 'Rotate often so the attention bar does not drop to zero.';
    if (phase === 'completed') return 'You held attention for the full session. Nice work.';
    if (phase === 'distracted') return 'You paused too long. Restart and keep gentle movement.';
    return 'Press Start, then drag around the spinner with touch or mouse.';
  }, [phase]);

  const size = 'min(82vw, min(50dvh, 320px))';

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden bg-[#0D0524] px-2 py-1 [@media(min-height:640px)]:py-3">
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm [@media(min-height:640px)]:p-6">
        <h2 className="text-center font-sans text-sm font-extrabold uppercase tracking-wide text-white/95 [@media(min-height:640px)]:text-base sm:text-lg">
          {phaseTitle}
        </h2>
        <p className="mt-1 text-center text-xs text-white/75 [@media(min-height:640px)]:text-sm">{phaseHint}</p>

        <div className="mt-3 w-full max-w-xs [@media(min-height:640px)]:mt-4" aria-live="polite">
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-white/80">
            <span>Time</span>
            <span className="font-bold text-white">{formatCountdown(timeRemainingMs)}</span>
          </div>
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wide text-white/80">
            <span>Attention</span>
            <span className="font-bold text-white">{Math.round(attention * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ef4444] via-[#f59e0b] to-[#22c55e] transition-[width] duration-150"
              style={{ width: `${Math.round(attention * 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-3 flex shrink-0 touch-none items-center justify-center select-none [@media(min-height:640px)]:mt-5" style={{ width: size, height: size }}>
          <div
            ref={wheelRef}
            role="application"
            aria-label="Focus spinner: drag around the wheel to rotate and keep attention"
            className="relative flex h-full w-full cursor-grab items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-[radial-gradient(circle_at_35%_30%,rgba(110,218,228,0.15)_0%,rgba(167,139,250,0.2)_42%,rgba(44,25,72,0.92)_100%)] shadow-[inset_0_2px_16px_rgba(0,0,0,0.35)] active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="absolute inset-[8%] rounded-full"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <Image
                src="/images/play/spinner-focus.png"
                alt="Purple fidget spinner"
                fill
                priority
                className="object-cover object-center mix-blend-multiply drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
              />
            </div>
            <div className="pointer-events-none absolute z-10 h-[14%] w-[14%] rounded-full border border-white/20 bg-[#171326]/85 shadow-[inset_0_2px_8px_rgba(255,255,255,0.06)]" />
          </div>
        </div>

        <div className="mt-3 flex w-full max-w-xs flex-wrap items-center justify-center gap-2 [@media(min-height:640px)]:mt-5">
          {(phase === 'intro' || phase === 'completed' || phase === 'distracted') && (
            <button
              type="button"
              onClick={phase === 'intro' ? startSession : restartSession}
              className="blunno-focus-visible rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/95 transition hover:bg-white/15"
            >
              {phase === 'intro' ? 'Start 2 min' : 'Try again'}
            </button>
          )}
          {phase === 'running' && (
            <button
              type="button"
              onClick={() => setPhase('intro')}
              className="blunno-focus-visible rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/95 transition hover:bg-white/15"
            >
              End session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
