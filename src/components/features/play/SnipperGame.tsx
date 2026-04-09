'use client';

import { useRef, useState, type ReactElement } from 'react';

import { audioService } from '@/services/audioService';

function angleFromPointer(x: number, y: number, rect: DOMRect): number {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(y - cy, x - cx) * (180 / Math.PI);
}

export function SnipperGame(): ReactElement {
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [lastAngle, setLastAngle] = useState<number | null>(null);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastAngle(angleFromPointer(e.clientX, e.clientY, rect));
    void audioService.play('pop');
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (lastAngle === null || !wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const current = angleFromPointer(e.clientX, e.clientY, rect);
    let delta = current - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    setRotation((r) => r + delta);
    setLastAngle(current);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setLastAngle(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      <p className="mb-4 text-center text-sm text-white/75">
        Drag the spinner to rotate and calm your focus.
      </p>
      <div
        ref={wheelRef}
        className="relative flex h-64 w-64 touch-none items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-xl"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute inset-4 rounded-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            background:
              'conic-gradient(from 0deg, #6EDAE4 0deg 60deg, #8B5CF6 60deg 120deg, #E7B453 120deg 180deg, #EC4899 180deg 240deg, #3B82F6 240deg 300deg, #22C55E 300deg 360deg)',
          }}
        />
        <div className="absolute h-8 w-8 rounded-full bg-white shadow-lg" />
      </div>
    </div>
  );
}
