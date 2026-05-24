'use client';

import { useCallback, useMemo, useState, type ReactElement } from 'react';

import { PlayGameShell } from '@/components/features/play/PlayGameShell';
import { cn } from '@/lib/utils';

const COLS = 3;
const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0] as const;
const ACCENT = '#D4A373';

function canSlide(index: number, emptyIndex: number, cols: number): boolean {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const emptyRow = Math.floor(emptyIndex / cols);
  const emptyCol = emptyIndex % cols;

  return (
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1)
  );
}

function shuffleSolvable(): number[] {
  let board = [...SOLVED];
  let emptyIndex = board.indexOf(0);
  const moveCount = 20 + Math.floor(Math.random() * 21);

  for (let step = 0; step < moveCount; step += 1) {
    const neighbors = board
      .map((_, index) => index)
      .filter((index) => canSlide(index, emptyIndex, COLS));

    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    board = board.map((value, index) => {
      if (index === pick) return 0;
      if (index === emptyIndex) return board[pick];
      return value;
    });
    emptyIndex = pick;
  }

  return board;
}

function isSolved(board: number[]): boolean {
  return board.every((value, index) => value === SOLVED[index]);
}

export function SlidePuzzleGame(): ReactElement {
  const [board, setBoard] = useState<number[]>(() => shuffleSolvable());
  const [moves, setMoves] = useState(0);

  const complete = useMemo(() => isSolved(board), [board]);

  const restart = useCallback(() => {
    setBoard(shuffleSolvable());
    setMoves(0);
  }, []);

  const slideTile = useCallback(
    (index: number) => {
      if (complete) return;

      let didMove = false;
      setBoard((prev) => {
        const emptyIndex = prev.indexOf(0);
        if (!canSlide(index, emptyIndex, COLS)) return prev;

        didMove = true;
        const next = [...prev];
        next[emptyIndex] = next[index];
        next[index] = 0;
        return next;
      });

      if (didMove) {
        setMoves((moveCount) => moveCount + 1);
      }
    },
    [complete]
  );

  const status = complete ? 'Complete!' : 'Slide tiles into order';

  return (
    <PlayGameShell
      testId="slide-game"
      scoreTestId="slide-moves"
      fieldTestId="slide-grid"
      scoreLabel={<>Moves: {moves}</>}
      status={status}
      showRestart={complete}
      onRestart={restart}
    >
      <div className="grid w-full max-w-[14rem] grid-cols-3 gap-2 sm:max-w-[16rem] sm:gap-2.5">
        {board.map((value, index) => {
          const isEmpty = value === 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => slideTile(index)}
              disabled={isEmpty || complete}
              className={cn('slide-tile', isEmpty && 'slide-tile--empty')}
              style={
                isEmpty
                  ? undefined
                  : {
                      background: `radial-gradient(circle at 30% 30%, #ffffff99, ${ACCENT})`,
                    }
              }
              aria-label={isEmpty ? 'Empty tile slot' : `Tile ${value}`}
            >
              {!isEmpty ? value : null}
            </button>
          );
        })}
      </div>
    </PlayGameShell>
  );
}
