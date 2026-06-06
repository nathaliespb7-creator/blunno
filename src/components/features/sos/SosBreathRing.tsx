'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useMemo, type PointerEvent, type ReactElement } from 'react';

import { useTranslation } from '@/i18n/useTranslation';

import { WELCOME_MASCOT_PNG, WELCOME_MASCOT_WEBP } from '@/lib/assets';
import {
  SOS_SCALE_MAX,
  SOS_SCALE_MIN,
  glowIntensityFromScale,
  scaleFromTimedCycleProgress,
  type SosBreathStatus,
  type SosMode,
} from '@/lib/sosBreathing';
import { cn } from '@/lib/utils';

const VIEW_SIZE = 320;
const CX = VIEW_SIZE / 2;
const CY = VIEW_SIZE / 2;

export type SosRingTuning = {
  ringDiameterPx: number;
  strokeWidthPx: number;
  blurPx: number;
  glowColor: string;
  blunnoSizePx: number;
  blunnoOffsetYPx: number;
};

type SosBreathRingProps = {
  mode: SosMode;
  status: SosBreathStatus;
  cycleProgress: number;
  tuning: SosRingTuning;
  onStart?: () => void;
  onTraceBegin?: (clientX: number, clientY: number, rect: DOMRect) => void;
  onTraceMove?: (clientX: number, clientY: number, rect: DOMRect) => void;
  onTraceEnd?: () => void;
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function buildRingFilters(blurPx: number, glowHex: string): { progress: string; wrapper: string } {
  const rgb = hexToRgb(glowHex);
  const fallback = '131, 169, 173';
  const rgba = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : fallback;
  const progress = [
    `drop-shadow(0 0 ${blurPx}px ${glowHex})`,
    `drop-shadow(0 0 ${blurPx * 1.8}px rgba(${rgba}, 0.28))`,
  ].join(' ');
  const wrapper = `0 0 ${blurPx * 1.6}px rgba(${rgba}, 0.28)`;
  return { progress, wrapper };
}

export function SosBreathRing({
  mode,
  status,
  cycleProgress,
  tuning,
  onStart,
  onTraceBegin,
  onTraceMove,
  onTraceEnd,
}: SosBreathRingProps): ReactElement {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const isGuided = mode === 'guided';
  const isTrace = mode === 'trace';
  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isCompleted = status === 'completed';
  const guidedTapStart = isGuided && isIdle;
  const traceActive = isTrace && !isCompleted;

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!traceActive || !onTraceBegin) return;
      const rect = event.currentTarget.getBoundingClientRect();
      onTraceBegin(event.clientX, event.clientY, rect);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [onTraceBegin, traceActive]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!traceActive || !onTraceMove || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const rect = event.currentTarget.getBoundingClientRect();
      onTraceMove(event.clientX, event.clientY, rect);
    },
    [onTraceMove, traceActive]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!traceActive || !onTraceEnd) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      onTraceEnd();
    },
    [onTraceEnd, traceActive]
  );

  const { ringRadius, strokeView, circ } = useMemo(() => {
    const d = Math.max(120, Math.min(tuning.ringDiameterPx, 480));
    const swPx = Math.max(2, Math.min(tuning.strokeWidthPx, 40));
    const sw = (swPx * VIEW_SIZE) / d;
    const rr = VIEW_SIZE / 2 - sw / 2;
    const r = Math.max(8, rr);
    const c = 2 * Math.PI * r;
    return { ringRadius: r, strokeView: sw, circ: c };
  }, [tuning.ringDiameterPx, tuning.strokeWidthPx]);

  const ringFilters = useMemo(
    () => buildRingFilters(tuning.blurPx, tuning.glowColor),
    [tuning.blurPx, tuning.glowColor]
  );

  const progressScale = scaleFromTimedCycleProgress(cycleProgress);
  const mascotScale = isRunning || isCompleted ? progressScale : undefined;

  const mascotGlowFilter = useMemo(() => {
    const intensity = glowIntensityFromScale(isRunning ? progressScale : SOS_SCALE_MIN);
    const cyanAlpha = 0.35 + intensity * 0.5;
    const magentaAlpha = 0.2 + intensity * 0.35;
    const cyanBlur = 20 + intensity * 25;
    const magentaBlur = 35 + intensity * 40;
    if (isRunning) {
      return `drop-shadow(0 0 ${cyanBlur}px rgba(0,255,209,${cyanAlpha})) drop-shadow(0 0 ${magentaBlur}px rgba(255,0,245,${magentaAlpha}))`;
    }
    return 'drop-shadow(0 0 20px rgba(0,255,209,0.45)) drop-shadow(0 0 40px rgba(255,0,245,0.3))';
  }, [isRunning, progressScale]);

  const dashArray = useMemo(() => {
    const drawn = circ * cycleProgress;
    return `${drawn} ${circ}`;
  }, [circ, cycleProgress]);

  const ringGlowStyle = { boxShadow: ringFilters.wrapper } as const;

  const ariaLabel = guidedTapStart
    ? t('sos.tapToStart')
    : isTrace && isIdle
      ? t('sos.tapToTrace')
      : t('sos.breathingProgress');

  return (
    <button
      type="button"
      className={cn(
        'sos-breath-ring relative mx-auto flex shrink-0 items-center justify-center overflow-visible rounded-full aspect-square border-0 bg-transparent p-0 touch-none',
        isCompleted && 'pointer-events-none opacity-[0.98]',
        guidedTapStart && 'cursor-pointer',
        traceActive && 'cursor-crosshair'
      )}
      style={ringGlowStyle}
      aria-label={ariaLabel}
      onClick={guidedTapStart ? onStart : undefined}
      onPointerDown={isTrace ? handlePointerDown : undefined}
      onPointerMove={isTrace ? handlePointerMove : undefined}
      onPointerUp={isTrace ? handlePointerUp : undefined}
      onPointerCancel={isTrace ? handlePointerUp : undefined}
      disabled={isCompleted || (isGuided && !guidedTapStart && !isRunning)}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 z-10 size-full overflow-visible"
      >
        <defs>
          <linearGradient
            id="sosRingGradient"
            gradientUnits="userSpaceOnUse"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00FFD1" />
            <stop offset="100%" stopColor="#FF00F5" />
          </linearGradient>
          <filter id="sosProgressGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`rotate(-90 ${CX} ${CY})`}>
          <circle
            cx={CX}
            cy={CY}
            r={ringRadius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeView}
            strokeLinecap="round"
          />
          <circle
            cx={CX}
            cy={CY + ringRadius}
            r={strokeView * 0.28}
            fill="rgba(255,255,255,0.22)"
          />
          <circle
            cx={CX}
            cy={CY}
            r={ringRadius}
            fill="none"
            stroke="url(#sosRingGradient)"
            strokeWidth={strokeView}
            strokeLinecap="round"
            strokeDasharray={dashArray}
            style={{ filter: 'url(#sosProgressGlow)' }}
          />
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          className="sos-breath-ring__mascot"
          style={{
            transformOrigin: 'center center',
            filter: mascotGlowFilter,
          }}
          animate={
            isCompleted
              ? { scale: [progressScale, progressScale * 1.06, progressScale] }
              : mascotScale !== undefined
                ? { scale: mascotScale }
                : reduceMotion
                  ? { scale: 1 }
                  : { scale: [SOS_SCALE_MIN, SOS_SCALE_MAX, SOS_SCALE_MIN] }
          }
          transition={
            isCompleted
              ? { duration: 0.7, ease: 'easeOut' }
              : mascotScale !== undefined
                ? { duration: 0, ease: 'linear' }
                : reduceMotion
                  ? { duration: 0 }
                  : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <picture>
            <source srcSet={WELCOME_MASCOT_WEBP} type="image/webp" />
            <img
              src={WELCOME_MASCOT_PNG}
              alt="Blunno character"
              data-testid="sos-mascot"
              decoding="async"
              fetchPriority="high"
              draggable={false}
              className="size-full object-contain object-center"
              style={{ transform: `translateY(${tuning.blunnoOffsetYPx}px)` }}
            />
          </picture>
        </motion.div>
      </div>
    </button>
  );
}
