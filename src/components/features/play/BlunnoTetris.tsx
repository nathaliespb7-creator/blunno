'use client';

import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';

import { audioService } from '@/services/audioService';

type Piece = {
  shape: number[][];
  x: number;
  y: number;
  color: number;
};

const BOARD_W = 10;
const BOARD_H = 20;

/* Colors from :root --tetris-* (play-grid-clear theme) */
const PIECE_COLOR_CLASS: Record<number, string> = {
  0: 'bg-[var(--tetris-cell-empty)] ring-1 ring-inset ring-[color:var(--tetris-grid-line)]',
  1: 'bg-[var(--tetris-piece-1)]',
  2: 'bg-[var(--tetris-piece-2)]',
  3: 'bg-[var(--tetris-piece-3)]',
  4: 'bg-[var(--tetris-piece-4)]',
  5: 'bg-[var(--tetris-piece-5)]',
  6: 'bg-[var(--tetris-piece-6)]',
  7: 'bg-[var(--tetris-piece-7)]',
};

const SHAPES: Array<{ shape: number[][]; color: number }> = [
  { shape: [[1, 1, 1, 1]], color: 1 },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 2,
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 3,
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 4,
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 5,
  },
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 6,
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 7,
  },
];

function emptyBoard(): number[][] {
  return Array.from({ length: BOARD_H }, () => Array.from({ length: BOARD_W }, () => 0));
}

function cloneShape(shape: number[][]): number[][] {
  return shape.map((row) => [...row]);
}

function createPiece(): Piece {
  const selected = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const shape = cloneShape(selected.shape);
  const x = Math.floor((BOARD_W - shape[0].length) / 2);
  return { shape, x, y: 0, color: selected.color };
}

function rotateRight(shape: number[][]): number[][] {
  const h = shape.length;
  const w = shape[0].length;
  const next = Array.from({ length: w }, () => Array.from({ length: h }, () => 0));
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      next[x][h - 1 - y] = shape[y][x];
    }
  }
  return next;
}

function collides(board: number[][], piece: Piece, dx = 0, dy = 0, shape?: number[][]): boolean {
  const matrix = shape ?? piece.shape;
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const nx = piece.x + x + dx;
      const ny = piece.y + y + dy;
      if (nx < 0 || nx >= BOARD_W || ny >= BOARD_H) return true;
      if (ny >= 0 && board[ny][nx] !== 0) return true;
    }
  }
  return false;
}

function lockPiece(board: number[][], piece: Piece): number[][] {
  const next = board.map((row) => [...row]);
  for (let y = 0; y < piece.shape.length; y += 1) {
    for (let x = 0; x < piece.shape[y].length; x += 1) {
      if (!piece.shape[y][x]) continue;
      const by = piece.y + y;
      const bx = piece.x + x;
      if (by >= 0 && by < BOARD_H && bx >= 0 && bx < BOARD_W) {
        next[by][bx] = piece.color;
      }
    }
  }
  return next;
}

function clearLines(board: number[][]): { board: number[][]; lines: number } {
  const kept = board.filter((row) => row.some((cell) => cell === 0));
  const lines = BOARD_H - kept.length;
  const padded = Array.from({ length: lines }, () => Array.from({ length: BOARD_W }, () => 0));
  return { board: [...padded, ...kept], lines };
}

export function BlunnoTetris(): ReactElement {
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [board, setBoard] = useState<number[][]>(() => emptyBoard());
  const [piece, setPiece] = useState<Piece>(() => createPiece());
  const [running, setRunning] = useState(true);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [topScore, setTopScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const parsed = Number(window.localStorage.getItem('blunno.tetris.topScore') ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  });

  const level = Math.max(1, Math.floor(lines / 10) + 1);
  const speed = useMemo(() => Math.floor(500 / (level + 1)), [level]);

  const unlockAudioOnce = useCallback((): void => {
    if (isAudioUnlocked) return;
    setIsAudioUnlocked(true);
    void audioService.ensureUnlocked();
  }, [isAudioUnlocked]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setPiece(createPiece());
    setScore(0);
    setLines(0);
    setPaused(false);
    setRunning(true);
  }, []);

  const togglePause = useCallback(() => {
    if (!running) return;
    setPaused((p) => !p);
  }, [running]);

  const move = useCallback(
    (dx: number) => {
      setPiece((prev) => {
        if (!running || paused || collides(board, prev, dx, 0)) return prev;
        return { ...prev, x: prev.x + dx };
      });
    },
    [board, running, paused]
  );

  const rotate = useCallback(() => {
    setPiece((prev) => {
      if (!running || paused) return prev;
      const rotated = rotateRight(prev.shape);
      if (collides(board, prev, 0, 0, rotated)) return prev;
      return { ...prev, shape: rotated };
    });
  }, [board, running, paused]);

  const lockPieceAndContinue = useCallback((mergedBoard: number[][]) => {
    const { board: cleared, lines: removed } = clearLines(mergedBoard);
    if (removed > 0) {
      setScore((s) => s + removed * 100);
      setLines((l) => l + removed);
      void audioService.play('pop');
    }

    const next = createPiece();
    if (collides(cleared, next)) {
      setBoard(cleared);
      setPaused(false);
      setRunning(false);
      return;
    }

    setBoard(cleared);
    setPiece(next);
  }, []);

  const stepDown = useCallback(() => {
    if (!running || paused) return;

    if (!collides(board, piece, 0, 1)) {
      setPiece((prev) => ({ ...prev, y: prev.y + 1 }));
      return;
    }

    const merged = lockPiece(board, piece);
    lockPieceAndContinue(merged);
  }, [board, piece, running, paused, lockPieceAndContinue]);

  const hardDrop = useCallback(() => {
    if (!running || paused) return;
    let y = piece.y;
    while (!collides(board, { ...piece, y }, 0, 1)) {
      y += 1;
    }
    const landed = { ...piece, y };
    const merged = lockPiece(board, landed);
    lockPieceAndContinue(merged);
  }, [board, piece, running, paused, lockPieceAndContinue]);

  useEffect(() => {
    if (!running || paused) return;
    const tick = Math.max(80, 520 - (level - 1) * 35);
    const id = window.setInterval(stepDown, tick);
    return () => window.clearInterval(id);
  }, [running, paused, level, stepDown]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
        return;
      }
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowDown') stepDown();
      if (e.key === 'ArrowUp') rotate();
      if (e.key === ' ') {
        e.preventDefault();
        hardDrop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, rotate, stepDown, hardDrop, togglePause]);

  useEffect(() => {
    if (score <= topScore) return;
    const id = window.setTimeout(() => {
      setTopScore(score);
      window.localStorage.setItem('blunno.tetris.topScore', String(score));
    }, 0);
    return () => window.clearTimeout(id);
  }, [score, topScore]);

  const renderBoard = useMemo(() => {
    const view = board.map((row) => [...row]);
    for (let y = 0; y < piece.shape.length; y += 1) {
      for (let x = 0; x < piece.shape[y].length; x += 1) {
        if (!piece.shape[y][x]) continue;
        const by = piece.y + y;
        const bx = piece.x + x;
        if (by >= 0 && by < BOARD_H && bx >= 0 && bx < BOARD_W) {
          view[by][bx] = piece.color;
        }
      }
    }
    return view;
  }, [board, piece]);

  const actionBtnClass =
    'blunno-focus-visible tetris-action-btn min-h-[44px] rounded-xl px-2 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:px-3 sm:text-xs md:text-sm';
  const dpadBtnClass =
    'blunno-focus-visible tetris-dpad-btn min-h-[44px] rounded-xl py-2 text-base font-semibold text-white active:scale-[0.98] sm:text-lg';

  return (
    <div
      className={[
        'theme-play-grid mx-auto flex h-full min-h-0 w-full max-w-[980px] flex-col',
        'gap-2 overflow-x-hidden overflow-y-auto overscroll-y-contain rounded-[28px] p-2',
        'text-[color:var(--color-text-primary)] sm:gap-2.5 sm:p-3 [@media(max-height:700px)]:gap-1.5 [@media(max-height:700px)]:p-1.5',
      ].join(' ')}
      onPointerDown={unlockAudioOnce}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-row gap-2 [@media(max-height:700px)]:gap-1.5 sm:gap-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            <div
              className={['relative w-full max-w-full', 'h-full max-h-full min-h-0', 'aspect-[1/2] w-auto'].join(' ')}
            >
              <div className="tetris-board-shell absolute inset-0 flex min-h-0 flex-col overflow-hidden rounded-[22px] p-1.5 sm:rounded-[24px] sm:p-2">
                <div className="grid h-full min-h-0 w-full min-w-0 grid-cols-10 auto-rows-[minmax(0,1fr)] gap-px sm:gap-[2px]">
                  {renderBoard.flatMap((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`${x}-${y}`}
                        className={['min-h-0 min-w-0 rounded-[2px]', PIECE_COLOR_CLASS[cell]].join(' ')}
                      />
                    ))
                  )}
                </div>
              </div>
              {running && paused && (
                <button
                  type="button"
                  onClick={togglePause}
                  className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[22px] border border-white/15 bg-[var(--overlay-scrim)] px-4 backdrop-blur-[2px] touch-manipulation sm:rounded-[24px]"
                  aria-label="Resume game"
                >
                  <span className="text-sm font-extrabold uppercase tracking-wider text-white">Paused</span>
                  <span className="text-xs text-white/80">Tap to continue</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <aside
          className={[
            'flex w-[7.25rem] shrink-0 flex-col gap-1.5 overflow-y-auto pr-0.5',
            'sm:w-[8.5rem] md:w-[13.5rem]',
            '[@media(max-height:700px)]:gap-1',
          ].join(' ')}
        >
          <div className="tetris-chip">
            <p className="tetris-chip-label">Level</p>
            <p className="tetris-chip-value">{level}</p>
          </div>
          <div className="tetris-chip">
            <p className="tetris-chip-label">Score</p>
            <p className="tetris-chip-value text-[var(--color-accent-primary)]">{score}</p>
          </div>
          <div className="tetris-chip">
            <p className="tetris-chip-label">Lines</p>
            <p className="tetris-chip-value">{lines}</p>
          </div>
          <div className="tetris-chip">
            <p className="tetris-chip-label">Top</p>
            <p className="tetris-chip-value">{topScore}</p>
          </div>
          <div className="tetris-chip">
            <p className="tetris-chip-label">Speed</p>
            <p className="tetris-chip-value">{speed}</p>
          </div>

          <div className="mt-0.5 flex flex-col gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={togglePause}
              disabled={!running}
              className={`${actionBtnClass} tetris-action-btn--pause disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button type="button" onClick={reset} className={`${actionBtnClass} tetris-action-btn--stop`}>
              {running ? 'Restart' : 'Start'}
            </button>
          </div>
        </aside>
      </div>

      <div className="flex shrink-0 flex-col gap-2 [@media(max-height:700px)]:gap-1.5">
        <div className="grid grid-cols-4 gap-1.5 text-center sm:gap-2 [@media(max-height:700px)]:gap-1">
          <button type="button" className={dpadBtnClass} onClick={() => move(-1)} aria-label="Move left">
            ←
          </button>
          <button type="button" className={dpadBtnClass} onClick={stepDown} aria-label="Move down">
            ↓
          </button>
          <button type="button" className={dpadBtnClass} onClick={() => move(1)} aria-label="Move right">
            →
          </button>
          <button
            type="button"
            className={`${dpadBtnClass} text-[var(--tetris-accent-secondary)]`}
            onClick={rotate}
            aria-label="Rotate piece"
          >
            ↻
          </button>
        </div>

        <button
          type="button"
          onClick={hardDrop}
          className="blunno-focus-visible tetris-drop-btn min-h-[46px] w-full rounded-2xl px-3 py-2 text-sm font-bold tracking-[0.08em] text-white"
          aria-label="Hard drop — instant fall"
        >
          Drop
        </button>
      </div>
    </div>
  );
}
