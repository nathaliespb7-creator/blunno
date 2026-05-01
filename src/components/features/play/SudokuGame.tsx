'use client';

import { useCallback, useMemo, useState, type ReactElement } from 'react';

import { audioService } from '@/services/audioService';

type Board = number[][];
type Cell = { row: number; col: number } | null;

const PUZZLES = [
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
  '300200000000107000706030500070009080900020004010800050009040301000702000000008006',
] as const;

function parsePuzzle(puzzle: string): Board {
  const values = puzzle.split('').map((v) => Number(v));
  const rows: Board = [];
  for (let i = 0; i < 9; i += 1) {
    rows.push(values.slice(i * 9, i * 9 + 9));
  }
  return rows;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function isPlacementValid(board: Board, row: number, col: number, value: number): boolean {
  if (value === 0) return true;

  for (let c = 0; c < 9; c += 1) {
    if (c !== col && board[row][c] === value) return false;
  }

  for (let r = 0; r < 9; r += 1) {
    if (r !== row && board[r][col] === value) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r += 1) {
    for (let c = startCol; c < startCol + 3; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) return false;
    }
  }

  return true;
}

function getConflictSet(board: Board): Set<string> {
  const conflicts = new Set<string>();
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const value = board[row][col];
      if (value === 0) continue;
      if (!isPlacementValid(board, row, col, value)) {
        conflicts.add(`${row}-${col}`);
      }
    }
  }
  return conflicts;
}

function isSolved(board: Board): boolean {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const value = board[row][col];
      if (value === 0 || !isPlacementValid(board, row, col, value)) {
        return false;
      }
    }
  }
  return true;
}

export function SudokuGame(): ReactElement {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [fixedBoard, setFixedBoard] = useState<Board>(() => parsePuzzle(PUZZLES[0]));
  const [board, setBoard] = useState<Board>(() => parsePuzzle(PUZZLES[0]));
  const [selected, setSelected] = useState<Cell>(null);

  const conflicts = useMemo(() => getConflictSet(board), [board]);
  const solved = useMemo(() => isSolved(board), [board]);

  const loadPuzzle = useCallback(async (nextIndex: number) => {
    const parsed = parsePuzzle(PUZZLES[nextIndex]);
    setPuzzleIndex(nextIndex);
    setFixedBoard(parsed);
    setBoard(cloneBoard(parsed));
    setSelected(null);
    await audioService.ensureUnlocked();
    await audioService.play('pop');
  }, []);

  const newPuzzle = useCallback(() => {
    const next = (puzzleIndex + 1) % PUZZLES.length;
    void loadPuzzle(next);
  }, [loadPuzzle, puzzleIndex]);

  const setCellValue = useCallback(
    (value: number) => {
      if (!selected) return;
      const { row, col } = selected;
      if (fixedBoard[row][col] !== 0) return;

      setBoard((prev) => {
        const next = cloneBoard(prev);
        next[row][col] = value;
        return next;
      });
    },
    [fixedBoard, selected]
  );

  const onCellClick = useCallback((row: number, col: number) => {
    setSelected({ row, col });
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!selected) return;
      if (/^[1-9]$/.test(e.key)) {
        setCellValue(Number(e.key));
      }
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setCellValue(0);
      }
    },
    [selected, setCellValue]
  );

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col overflow-hidden bg-[#0D0524] px-1.5 py-1 text-white sm:px-2 sm:py-2">
      <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:gap-4 sm:p-5">
        <div className="w-full text-center">
          <h2 className="font-sans text-base font-extrabold uppercase tracking-wide text-white sm:text-lg">Sudoku</h2>
          <p className="mt-1 text-xs text-white/70 sm:text-sm">Fill the grid so each row, column, and 3x3 box uses digits 1-9.</p>
        </div>

        <div
          role="application"
          tabIndex={0}
          onKeyDown={onKeyDown}
          className="grid w-full max-w-[min(92vw,460px)] grid-cols-9 rounded-xl border border-white/25 bg-[#111236] p-1 outline-none"
          aria-label="Sudoku board"
        >
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const isFixed = fixedBoard[rowIndex][colIndex] !== 0;
              const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
              const isSameRow = selected?.row === rowIndex;
              const isSameCol = selected?.col === colIndex;
              const isConflict = conflicts.has(`${rowIndex}-${colIndex}`);

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => onCellClick(rowIndex, colIndex)}
                  className={[
                    'aspect-square border border-white/10 text-center text-sm font-bold transition sm:text-base',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]/70',
                    isFixed ? 'bg-[#1a1a44] text-white' : 'bg-[#101233] text-[var(--color-accent-primary)]',
                    isSameRow || isSameCol ? 'bg-[#1a214f]' : '',
                    isSelected ? 'ring-2 ring-inset ring-[var(--color-accent-primary)]' : '',
                    isConflict ? 'bg-[#3c1325] text-[#fb7185]' : '',
                    rowIndex % 3 === 0 ? 'border-t-white/40' : '',
                    colIndex % 3 === 0 ? 'border-l-white/40' : '',
                    rowIndex === 8 ? 'border-b-white/40' : '',
                    colIndex === 8 ? 'border-r-white/40' : '',
                  ].join(' ')}
                  aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1} value ${value || 'empty'}`}
                >
                  {value === 0 ? '' : value}
                </button>
              );
            })
          )}
        </div>

        <div className="grid w-full max-w-[min(92vw,460px)] grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setCellValue(num)}
              className="blunno-focus-visible glass-button min-h-[44px] rounded-xl text-sm font-bold text-white"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCellValue(0)}
            className="blunno-focus-visible glass-button col-span-2 min-h-[44px] rounded-xl text-xs font-bold uppercase tracking-wide text-white/90"
          >
            Clear cell
          </button>
          <button
            type="button"
            onClick={newPuzzle}
            className="blunno-focus-visible glass-button col-span-3 min-h-[44px] rounded-xl text-xs font-bold uppercase tracking-wide text-[var(--color-accent-primary)]"
          >
            New puzzle
          </button>
        </div>

        <div className="w-full text-center text-sm font-semibold">
          {solved ? (
            <p className="text-[#4ade80]">Solved. Great focus.</p>
          ) : conflicts.size > 0 ? (
            <p className="text-[#fb7185]">There are conflicts in the highlighted cells.</p>
          ) : (
            <p className="text-white/70">Select a cell and use keypad or keyboard (1-9).</p>
          )}
        </div>
      </div>
    </div>
  );
}
