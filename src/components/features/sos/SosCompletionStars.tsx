'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, type ReactElement } from 'react';

const STAR_COUNT = 36;

const STAR_COLORS = ['#00FFD1', '#FF00F5', '#FFFFFF', '#C4B5FD'] as const;

type StarSpec = {
  id: number;
  leftPct: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  color: string;
  peakOpacity: number;
};

function buildStars(): StarSpec[] {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    leftPct: (i * 37 + 11) % 94 + 3,
    delay: (i * 0.09) % 1.4,
    duration: 2.2 + (i % 4) * 0.35,
    size: 7 + (i % 4) * 2.5,
    drift: ((i % 7) - 3) * 14,
    color: STAR_COLORS[i % STAR_COLORS.length],
    peakOpacity: 0.55 + (i % 3) * 0.18,
  }));
}

function StarShape({ size, color }: { size: number; color: string }): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden
      className="overflow-visible"
    >
      <path
        d="M6 0.5 L7.2 4.3 L11 4.8 L8.2 7.5 L9 11.2 L6 9.2 L3 11.2 L3.8 7.5 L1 4.8 L4.8 4.3 Z"
        fill={color}
      />
    </svg>
  );
}

export function SosCompletionStars(): ReactElement {
  const reduceMotion = useReducedMotion();
  const stars = useMemo(() => buildStars(), []);

  if (reduceMotion) {
    return <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute top-0 will-change-transform"
          style={{
            left: `${star.leftPct}%`,
            filter: `drop-shadow(0 0 ${star.size}px ${star.color})`,
          }}
          initial={{ y: '-8%', x: 0, opacity: 0, rotate: 0 }}
          animate={{
            y: '108vh',
            x: star.drift,
            opacity: [0, star.peakOpacity, star.peakOpacity * 0.6, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: 'linear',
            times: [0, 0.12, 0.7, 1],
          }}
        >
          <StarShape size={star.size} color={star.color} />
        </motion.div>
      ))}
    </div>
  );
}
