'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from 'react';

import { useTranslation } from '@/i18n/useTranslation';
import { audioService } from '@/services/audioService';

export const POPIT_BUBBLE_COUNT = 30;

type GamePhase = 'idle' | 'inflating' | 'playing';

type BubblePhase = 'spawn' | 'alive' | 'popping' | 'dead';

type BubbleTone = 'lavender' | 'sky' | 'mint' | 'peach' | 'gold';

type Bubble = {
  id: number;
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: BubblePhase;
  phaseT: number;
  tone: BubbleTone;
  colorStart: string;
  colorEnd: string;
  highlight: string;
};

const BUBBLE_TONES = [
  { tone: 'lavender' as const, start: '#c6adff', end: '#8f7bff', highlight: '#f8f1ff' },
  { tone: 'sky' as const, start: '#bde9ff', end: '#7fc8ff', highlight: '#f3fdff' },
  { tone: 'mint' as const, start: '#b8f5de', end: '#7fe0c2', highlight: '#f0fff9' },
  { tone: 'peach' as const, start: '#ffd2b2', end: '#ffab82', highlight: '#fff4ea' },
  { tone: 'gold' as const, start: '#ffe7ac', end: '#ffd27a', highlight: '#fff9ea' },
];

const INFLATE_RATE = 4.5;
const AUTO_INFLATE_RATE = 2.2;
const MAX_BUBBLES = 28;
const SPAWN_INTERVAL_MS = 420;
const POP_DURATION_MS = 200;
const SPAWN_DURATION_MS = 360;

function pseudoRandom(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function pickTone(seed: number) {
  return BUBBLE_TONES[Math.floor(pseudoRandom(seed) * BUBBLE_TONES.length)] ?? BUBBLE_TONES[0];
}

function createBubble(id: number, width: number, height: number, seed: number): Bubble {
  const tone = pickTone(seed);
  const margin = 28;
  const r = 16 + pseudoRandom(seed + 3) * 14;
  const centerBias = id === 0 || id < 4;

  const x = id === 0 ? width * 0.5 : centerBias
    ? width * 0.5 + (pseudoRandom(seed + 1) - 0.5) * 48
    : margin + pseudoRandom(seed + 1) * Math.max(40, width - margin * 2);
  const y = id === 0 ? height * 0.5 : centerBias
    ? height * 0.5 + (pseudoRandom(seed + 2) - 0.5) * 48
    : margin + pseudoRandom(seed + 2) * Math.max(40, height - margin * 2);

  return {
    id,
    x,
    y,
    r,
    vx: (pseudoRandom(seed + 4) - 0.5) * 0.35,
    vy: (pseudoRandom(seed + 5) - 0.5) * 0.35,
    phase: 'spawn',
    phaseT: 0,
    tone: tone.tone,
    colorStart: tone.start,
    colorEnd: tone.end,
    highlight: tone.highlight,
  };
}

function drawBubble(ctx: CanvasRenderingContext2D, bubble: Bubble, reducedMotion: boolean): void {
  if (bubble.phase === 'dead') return;

  let scale = 1;
  let alpha = 1;

  if (bubble.phase === 'spawn') {
    const t = reducedMotion ? 1 : bubble.phaseT;
    scale = 0.2 + t * 0.8;
    alpha = 0.35 + t * 0.65;
  } else if (bubble.phase === 'popping') {
    const t = reducedMotion ? 1 : bubble.phaseT;
    scale = 1 - t * 0.85;
    alpha = 1 - t;
  }

  const radius = bubble.r * scale;
  if (radius <= 0.5 || alpha <= 0.02) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(bubble.x, bubble.y);

  const base = ctx.createRadialGradient(-radius * 0.2, -radius * 0.25, radius * 0.1, 0, 0, radius);
  base.addColorStop(0, bubble.colorStart);
  base.addColorStop(1, bubble.colorEnd);
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  const highlight = ctx.createRadialGradient(-radius * 0.35, -radius * 0.4, 0, -radius * 0.15, -radius * 0.15, radius * 0.75);
  highlight.addColorStop(0, bubble.highlight);
  highlight.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.38)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 0.6, 0, Math.PI * 2);
  ctx.stroke();

  if (bubble.phase === 'popping' && bubble.phaseT > 0.15) {
    const ripple = (bubble.phaseT - 0.15) / 0.85;
    ctx.strokeStyle = `rgba(255,255,255,${(1 - ripple) * 0.45})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius + ripple * 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function hitTest(bubbles: Bubble[], x: number, y: number): Bubble | null {
  for (let index = bubbles.length - 1; index >= 0; index -= 1) {
    const bubble = bubbles[index];
    if (bubble.phase !== 'alive' && bubble.phase !== 'spawn') continue;
    const radius = bubble.r + 6;
    const dx = x - bubble.x;
    const dy = y - bubble.y;
    if (dx * dx + dy * dy <= radius * radius) return bubble;
  }
  return null;
}

export function BalloonPop(): ReactElement {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const seedRef = useRef(1);
  const sizeRef = useRef({ width: 320, height: 280 });
  const inflatingRef = useRef(false);
  const autoInflateRef = useRef(false);
  const spawnedRef = useRef(false);
  const bootstrappedRef = useRef(false);
  const liveBubbleCountRef = useRef(0);
  const audioUnlockedRef = useRef(false);

  const [phase, setPhase] = useState<GamePhase>('idle');
  const [inflateProgress, setInflateProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [liveBubbleCount, setLiveBubbleCount] = useState(0);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const stopInflateLoop = useCallback(() => {
    inflatingRef.current = false;
    autoInflateRef.current = false;
  }, []);

  const startPlaying = useCallback(() => {
    if (spawnedRef.current) return;
    spawnedRef.current = true;
    bootstrappedRef.current = false;
    bubblesRef.current = [];
    setPhase('playing');
    setInflateProgress(100);
    stopInflateLoop();
    lastSpawnRef.current = performance.now();
    liveBubbleCountRef.current = 0;
    setLiveBubbleCount(0);
  }, [stopInflateLoop]);

  const syncLiveBubbleCount = useCallback((nextCount: number) => {
    if (liveBubbleCountRef.current === nextCount) return;
    liveBubbleCountRef.current = nextCount;
    setLiveBubbleCount(nextCount);
  }, []);

  const tickInflateRef = useRef<() => void>(() => {});

  const tickInflate = useCallback(
    () => {
      if (!inflatingRef.current && !autoInflateRef.current) return;

      setInflateProgress((prev) => {
        const rate = inflatingRef.current ? INFLATE_RATE : AUTO_INFLATE_RATE;
        const next = Math.min(100, prev + rate * 0.9);
        if (next >= 100) queueMicrotask(startPlaying);
        return next;
      });

      if (inflatingRef.current || autoInflateRef.current) {
        requestAnimationFrame(tickInflateRef.current);
      }
    },
    [startPlaying],
  );

  useEffect(() => {
    tickInflateRef.current = tickInflate;
  }, [tickInflate]);

  const startInflate = useCallback(
    (auto = false) => {
      if (phase !== 'idle' && phase !== 'inflating') return;
      setPhase('inflating');
      inflatingRef.current = !auto;
      autoInflateRef.current = auto;
      requestAnimationFrame(tickInflate);
    },
    [phase, tickInflate],
  );

  const stopInflate = useCallback(() => {
    if (phase !== 'inflating') return;
    inflatingRef.current = false;
    autoInflateRef.current = false;
    setInflateProgress((prev) => {
      if (prev >= 100) return prev;
      setPhase('idle');
      return 0;
    });
  }, [phase]);

  const restart = useCallback(() => {
    stopInflateLoop();
    spawnedRef.current = false;
    bootstrappedRef.current = false;
    bubblesRef.current = [];
    nextIdRef.current = 0;
    seedRef.current = 1;
    lastSpawnRef.current = 0;
    setPhase('idle');
    setInflateProgress(0);
    setScore(0);
    liveBubbleCountRef.current = 0;
    setLiveBubbleCount(0);
  }, [stopInflateLoop]);

  const resizeCanvas = useCallback(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return;

    const rect = field.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sizeRef.current = { width: rect.width, height: rect.height };
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const renderFrame = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const last = lastFrameRef.current ?? timestamp;
      const delta = Math.min(32, timestamp - last);
      lastFrameRef.current = timestamp;

      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      if (phase === 'playing') {
        if (!bootstrappedRef.current && width > 40 && height > 40) {
          bootstrappedRef.current = true;
          bubblesRef.current.push(createBubble(nextIdRef.current++, width, height, seedRef.current++));
          lastSpawnRef.current = timestamp;
        }

        const aliveCount = bubblesRef.current.filter((b) => b.phase === 'spawn' || b.phase === 'alive' || b.phase === 'popping').length;

        if (aliveCount < MAX_BUBBLES && timestamp - lastSpawnRef.current >= SPAWN_INTERVAL_MS) {
          lastSpawnRef.current = timestamp;
          const seed = seedRef.current++;
          bubblesRef.current.push(createBubble(nextIdRef.current++, width, height, seed));
        }

        bubblesRef.current = bubblesRef.current.flatMap((bubble) => {
          if (bubble.phase === 'dead') return [];

          if (bubble.phase === 'spawn') {
            bubble.phaseT = reducedMotion ? 1 : Math.min(1, bubble.phaseT + delta / SPAWN_DURATION_MS);
            if (bubble.phaseT >= 1) {
              bubble.phase = 'alive';
              bubble.phaseT = 0;
            }
          } else if (bubble.phase === 'popping') {
            bubble.phaseT = reducedMotion ? 1 : Math.min(1, bubble.phaseT + delta / POP_DURATION_MS);
            if (bubble.phaseT >= 1) {
              return [];
            }
          } else if (bubble.phase === 'alive' && !reducedMotion) {
            bubble.x += bubble.vx * (delta / 16);
            bubble.y += bubble.vy * (delta / 16);
            if (bubble.x < bubble.r + 8 || bubble.x > width - bubble.r - 8) bubble.vx *= -1;
            if (bubble.y < bubble.r + 8 || bubble.y > height - bubble.r - 8) bubble.vy *= -1;
          }

          return [bubble];
        });

        syncLiveBubbleCount(
          bubblesRef.current.filter((bubble) => bubble.phase === 'spawn' || bubble.phase === 'alive').length,
        );
      }

      for (const bubble of bubblesRef.current) {
        drawBubble(ctx, bubble, reducedMotion);
      }
    },
    [phase, reducedMotion, syncLiveBubbleCount],
  );

  useEffect(() => {
    if (phase !== 'playing') return undefined;
    const id = requestAnimationFrame(() => resizeCanvas());
    return () => cancelAnimationFrame(id);
  }, [phase, resizeCanvas]);

  useEffect(() => {
    resizeCanvas();
    const field = fieldRef.current;
    if (!field) return undefined;

    const observer = new ResizeObserver(() => resizeCanvas());
    observer.observe(field);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    if (phase !== 'playing') {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return undefined;
    }

    const loop = (timestamp: number) => {
      renderFrame(timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [phase, renderFrame]);

  const ensureAudioReady = useCallback(async (): Promise<boolean> => {
    if (audioUnlockedRef.current) return true;

    await audioService.ensureUnlocked();
    audioUnlockedRef.current = true;
    return true;
  }, []);

  const playPopSound = useCallback(async () => {
    await ensureAudioReady();
    await audioService.play('pop');
  }, [ensureAudioReady]);

  const handleCanvasPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      if (phase !== 'playing') return;

      event.preventDefault();

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const target = hitTest(bubblesRef.current, x, y);
      if (!target || target.phase === 'popping') return;

      target.phase = 'popping';
      target.phaseT = 0;
      setScore((prev) => prev + 1);
      void playPopSound();
    },
    [phase, playPopSound],
  );

  const handleBlowPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    void ensureAudioReady();
    startInflate(false);
  };

  const handleBlowPointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    stopInflate();
  };

  const handleBlowClick = () => {
    if (phase === 'idle') {
      void ensureAudioReady();
      startInflate(true);
    }
  };

  const status = useMemo(() => {
    if (phase === 'idle') return t('play.balloon.statusIdle');
    if (phase === 'inflating') return t('play.balloon.statusInflating');
    return t('play.balloon.statusPlaying');
  }, [phase, t]);

  return (
    <div className="popit-game mx-auto flex h-full min-h-0 w-full max-w-md flex-col" data-testid="popit-game">
      <div className="popit-score-bar mb-2 flex shrink-0 items-center justify-between px-3 py-2 text-sm font-semibold">
        <span data-testid="popit-score">{t('play.poppedCount', { count: score })}</span>
        {phase === 'playing' && (
          <span className="text-xs font-medium text-[#d7d2ea]" data-testid="popit-live-count">
            {t('play.liveCount', { count: liveBubbleCount })}
          </span>
        )}
      </div>

      <div
        ref={fieldRef}
        className="popit-field relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border p-3"
        data-testid="popit-field"
        data-playing={phase === 'playing' ? 'true' : 'false'}
      >
        {(phase === 'idle' || phase === 'inflating') && (
          <div className="popit-blow-panel">
            <p className="popit-blow-hint">{t('play.balloon.blowHint')}</p>
            <button
              type="button"
              data-testid="popit-blow"
              className="popit-blow-btn blunno-focus-visible"
              aria-label={t('play.balloon.blowAria')}
              onPointerDown={handleBlowPointerDown}
              onPointerUp={handleBlowPointerUp}
              onPointerCancel={handleBlowPointerUp}
              onClick={handleBlowClick}
            >
              <span className="popit-blow-btn-label">{t('play.blow')}</span>
              <span className="popit-blow-progress" style={{ width: `${inflateProgress}%` }} aria-hidden />
            </button>
          </div>
        )}

        {phase === 'playing' && (
          <>
            <canvas
              ref={canvasRef}
              className="popit-canvas blunno-focus-visible"
              data-testid="popit-canvas"
              aria-label={t('play.balloon.filmAria')}
              onPointerDown={handleCanvasPointerDown}
            />
            <div className="popit-film-overlay pointer-events-none" aria-hidden />
          </>
        )}
      </div>

      <p className="popit-status mt-2 shrink-0 px-3 py-2 text-center text-sm">{status}</p>

      {phase === 'playing' && (
        <div className="mt-2 flex shrink-0 justify-center">
          <button
            type="button"
            onClick={restart}
            className="popit-restart-btn blunno-focus-visible px-4 py-2 text-sm font-semibold"
          >
            {t('play.restart')}
          </button>
        </div>
      )}
    </div>
  );
}
