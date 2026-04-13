'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type ReactElement,
  type RefAttributes,
} from 'react';
import dynamic from 'next/dynamic';
import type { Tetris2Handle, Tetris2Props } from 'react-tetris2';

import { audioService } from '@/services/audioService';

const Tetris2 = dynamic(() => import('react-tetris2'), { ssr: false }) as ForwardRefExoticComponent<
  Tetris2Props & RefAttributes<Tetris2Handle>
>;

const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const PREVIEW_COLS = 4;
const PREVIEW_ROWS = 4;

const PIECE_COLORS: Record<string, string> = {
  i: '#5EEAD4',
  j: '#60A5FA',
  l: '#F59E0B',
  o: '#FDE047',
  s: '#86EFAC',
  t: '#C084FC',
  z: '#F87171',
};

function getPieceColor(classes: DOMTokenList): string | null {
  for (const className of Array.from(classes)) {
    if (!className.startsWith('piece-')) {
      continue;
    }

    const key = className.replace('piece-', '').toLowerCase();
    return PIECE_COLORS[key] ?? null;
  }

  return null;
}

function extractMetric(root: HTMLElement, label: string): number | null {
  const normalizedLabel = label.toLowerCase();
  const labelElement = Array.from(root.querySelectorAll('p')).find(
    (node) => node.textContent?.trim().toLowerCase() === normalizedLabel
  );
  const valueBlock = labelElement?.closest('div')?.nextElementSibling;
  const value = Number(valueBlock?.textContent?.trim() ?? NaN);
  return Number.isFinite(value) ? value : null;
}

function drawGrid(
  canvas: HTMLCanvasElement | null,
  colors: Array<string | null>,
  cols: number,
  rows: number
): void {
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const cellW = canvas.width / cols;
  const cellH = canvas.height / rows;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#120A2F';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  colors.forEach((color, i) => {
    const x = (i % cols) * cellW;
    const y = Math.floor(i / cols) * cellH;

    ctx.fillStyle = color ?? 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 1, y + 1, cellW - 2, cellH - 2);
  });
}

export function BlunnoTetris(): ReactElement {
  const tetrisRef = useRef<Tetris2Handle | null>(null);
  const hiddenRootRef = useRef<HTMLDivElement | null>(null);
  const gameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const holdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [score, setScore] = useState(0);
  const [topScore, setTopScore] = useState(() => {
    if (typeof window === 'undefined') {
      return 0;
    }

    try {
      const raw = window.localStorage.getItem('blunno.tetris.topScore');
      const parsed = Number(raw ?? 0);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch {
      return 0;
    }
  });
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [tetrisCount, setTetrisCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const previousLinesRef = useRef(0);

  const unlockAudioOnce = useCallback((): void => {
    if (isAudioUnlocked) {
      return;
    }

    setIsAudioUnlocked(true);
    void audioService.ensureUnlocked();
  }, [isAudioUnlocked]);

  const handlePointerDown = (): void => {
    unlockAudioOnce();
  };

  const handleKeyDownCapture = (): void => {
    unlockAudioOnce();
  };

  const emitKey = (key: 'ArrowLeft' | 'ArrowRight' | 'ArrowDown' | 'ArrowUp' | ' '): void => {
    unlockAudioOnce();
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  const handleStart = (): void => {
    unlockAudioOnce();

    if (!hasStarted) {
      tetrisRef.current?.start();
      setHasStarted(true);
      setGameOver(false);
    } else {
      tetrisRef.current?.restart();
      setGameOver(false);
    }

    void audioService.play('inhale');
  };

  const speed = useMemo(() => Math.floor(500 / (level + 1)), [level]);

  const handleScoreChange = useCallback((nextScore: number): void => {
    setScore(nextScore);
    setTopScore((prevTop) => {
      if (nextScore <= prevTop) {
        return prevTop;
      }

      try {
        window.localStorage.setItem('blunno.tetris.topScore', String(nextScore));
      } catch {
        // localStorage unavailable; ignore persistence.
      }
      return nextScore;
    });
  }, []);

  useEffect(() => {
    const syncFromInternalUi = () => {
      const root = hiddenRootRef.current?.querySelector<HTMLElement>('[data-testid="tetris2-root"]');
      if (!root) {
        return;
      }

      const boardBlocks = root.querySelectorAll('[data-testid="gameboard"] .game-block');
      if (boardBlocks.length === BOARD_COLS * BOARD_ROWS) {
        const boardColors = Array.from(boardBlocks).map((cell) => getPieceColor(cell.classList));
        drawGrid(gameCanvasRef.current, boardColors, BOARD_COLS, BOARD_ROWS);
      }

      const holdTitle = Array.from(root.querySelectorAll('h1')).find((node) => node.textContent?.trim() === 'HOLD');
      const holdBlocks = holdTitle?.parentElement?.querySelectorAll('.piece-view .game-block') ?? [];
      if (holdBlocks.length >= PREVIEW_COLS * PREVIEW_ROWS) {
        const colors = Array.from(holdBlocks)
          .slice(0, PREVIEW_COLS * PREVIEW_ROWS)
          .map((cell) => getPieceColor(cell.classList));
        drawGrid(holdCanvasRef.current, colors, PREVIEW_COLS, PREVIEW_ROWS);
      }

      const nextTitle = Array.from(root.querySelectorAll('h1')).find((node) => node.textContent?.trim() === 'NEXT');
      const nextPieceView = nextTitle?.parentElement?.querySelector('.piece-view');
      const nextBlocks = nextPieceView?.querySelectorAll('.game-block') ?? [];
      if (nextBlocks.length >= PREVIEW_COLS * PREVIEW_ROWS) {
        const colors = Array.from(nextBlocks)
          .slice(0, PREVIEW_COLS * PREVIEW_ROWS)
          .map((cell) => getPieceColor(cell.classList));
        drawGrid(nextCanvasRef.current, colors, PREVIEW_COLS, PREVIEW_ROWS);
      }

      const parsedLines = extractMetric(root, 'Lines');
      if (parsedLines !== null) {
        const delta = parsedLines - previousLinesRef.current;
        if (delta > 0) {
          void audioService.play('pop');
          if (delta === 4) {
            setTetrisCount((prev) => prev + 1);
          }
        }
        previousLinesRef.current = parsedLines;
        setLines(parsedLines);
      }

      const parsedLevel = extractMetric(root, 'Level');
      if (parsedLevel !== null) {
        setLevel(parsedLevel);
      }
    };

    const intervalId = window.setInterval(syncFromInternalUi, 80);
    syncFromInternalUi();
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      className="mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-[#0D0524] p-2 text-white sm:p-3"
      onPointerDown={handlePointerDown}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <div className="grid w-full max-w-[420px] grid-cols-2 gap-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center backdrop-blur-sm">
          <p className="text-xs tracking-wide text-white/70">SCORE</p>
          <p className="text-3xl font-extrabold text-[#5EEAD4] sm:text-4xl">{score}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center backdrop-blur-sm">
          <p className="text-xs tracking-wide text-white/70">TOP</p>
          <p className="text-3xl font-extrabold text-[#BDB2FF] sm:text-4xl">{topScore}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-1.5 text-center backdrop-blur-sm">
        <p className="text-xs font-semibold tracking-[0.22em] text-white/80">
          TETPIVC <span className="ml-1 text-[#FFADAD]">{tetrisCount}</span>
        </p>
      </div>

      <div className="flex w-full items-start justify-center gap-1.5 sm:gap-3">
        <div className="w-[78px] rounded-xl border border-white/10 bg-white/5 p-1.5 text-center backdrop-blur-sm sm:w-[100px] sm:p-2">
          <p className="mb-1 text-xs font-semibold tracking-wide text-white/70">HOLD</p>
          <canvas
            ref={holdCanvasRef}
            width={100}
            height={100}
            className="mx-auto h-14 w-14 rounded-md bg-[#120A2F] sm:h-20 sm:w-20"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-1 shadow-lg backdrop-blur-sm">
          <canvas
            ref={gameCanvasRef}
            width={300}
            height={600}
            className="h-auto w-[min(58vw,300px)] max-w-[300px] rounded-xl border border-white/10 bg-[#120A2F]"
          />
        </div>

        <div className="w-[78px] rounded-xl border border-white/10 bg-white/5 p-1.5 text-center backdrop-blur-sm sm:w-[100px] sm:p-2">
          <p className="mb-1 text-xs font-semibold tracking-wide text-white/70">NEXT</p>
          <canvas
            ref={nextCanvasRef}
            width={100}
            height={100}
            className="mx-auto h-14 w-14 rounded-md bg-[#120A2F] sm:h-20 sm:w-20"
          />
        </div>
      </div>

      <div className="grid w-full max-w-[420px] grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur-sm">
          <p className="text-xs tracking-wide text-white/70">COMBO</p>
          <p className="text-2xl font-bold text-[#FFADAD]">{combo}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur-sm">
          <p className="text-xs tracking-wide text-white/70">LINES</p>
          <p className="text-2xl font-bold text-[#2DD4BF]">{lines}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur-sm">
          <p className="text-xs tracking-wide text-white/70">LEVEL</p>
          <p className="text-2xl font-bold text-[#2DD4BF]">{level}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur-sm">
          <p className="text-xs tracking-wide text-white/70">SPEED</p>
          <p className="text-2xl font-bold text-[#5EEAD4]">{speed}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="rounded-full bg-[#BDB2FF] px-7 py-2 text-sm font-bold text-white transition hover:scale-105 hover:bg-[#a89cfa]"
      >
        {hasStarted && !gameOver ? 'RESTART' : 'START'}
      </button>

      <div className="grid w-full max-w-xs grid-cols-4 gap-2 text-center">
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 py-2 text-lg font-semibold"
          onTouchStart={() => emitKey('ArrowLeft')}
          onClick={() => emitKey('ArrowLeft')}
          aria-label="Move left"
        >
          ←
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 py-2 text-lg font-semibold"
          onTouchStart={() => emitKey('ArrowDown')}
          onClick={() => emitKey('ArrowDown')}
          aria-label="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 py-2 text-lg font-semibold"
          onTouchStart={() => emitKey('ArrowRight')}
          onClick={() => emitKey('ArrowRight')}
          aria-label="Move right"
        >
          →
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/10 py-2 text-lg font-semibold"
          onTouchStart={() => emitKey('ArrowUp')}
          onClick={() => emitKey('ArrowUp')}
          aria-label="Rotate piece"
        >
          ↻
        </button>
      </div>

      <div ref={hiddenRootRef} className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
        <Tetris2
          ref={tetrisRef}
          soundEnabled={false}
          showControlsLegend={false}
          showModals={false}
          onScoreChange={handleScoreChange}
          onLevelChange={setLevel}
          onGameOver={() => {
            setGameOver(true);
            setCombo(0);
            void audioService.play('exhale');
          }}
        />
      </div>
    </div>
  );
}
