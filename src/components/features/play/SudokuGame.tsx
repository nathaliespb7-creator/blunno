'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import { audioService } from '@/services/audioService';

type Board = number[][];
type Cell = { row: number; col: number } | null;

const PUZZLES = [
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
  '300200000000107000706030500070009080900020004010800050009040301000702000000008006',
] as const;

// #region agent log
function debugLog(runId: string, hypothesisId: string, location: string, message: string, data: Record<string, unknown>): void {
  fetch('http://127.0.0.1:7625/ingest/8ca15716-a0fc-49e7-a068-15acecfda9c0', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '401711' },
    body: JSON.stringify({
      sessionId: '401711',
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const boardRegionRef = useRef<HTMLElement | null>(null);
  const boardGridRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    // #region agent log
    const sampleLayout = (reason: string) => {
      if (!cardRef.current || !headerRef.current || !boardRegionRef.current || !controlsRef.current || !statusRef.current) return;
      const card = cardRef.current.getBoundingClientRect();
      const header = headerRef.current.getBoundingClientRect();
      const boardRegion = boardRegionRef.current.getBoundingClientRect();
      const boardGrid = boardGridRef.current?.getBoundingClientRect();
      const controls = controlsRef.current.getBoundingClientRect();
      const status = statusRef.current.getBoundingClientRect();
      const requiredStack = header.height + boardRegion.height + controls.height;
      const controlsOverflowIntoBoard = boardRegion.bottom > controls.top;
      debugLog('sudoku-desktop-overlap', 'H1', 'SudokuGame.tsx:sampleLayout', 'sudoku layout sample', {
        reason,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        cardH: Math.round(card.height),
        headerH: Math.round(header.height),
        boardRegionH: Math.round(boardRegion.height),
        boardGridH: boardGrid ? Math.round(boardGrid.height) : null,
        controlsH: Math.round(controls.height),
        statusH: Math.round(status.height),
        requiredStackH: Math.round(requiredStack),
        overflowH: Math.round(requiredStack - card.height),
        controlsOverflowIntoBoard,
      });
    };

    const onResize = () => sampleLayout('resize');
    sampleLayout('mount');
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // #endregion
  }, []);

  return (
    <div ref={rootRef} className="mx-auto flex h-full min-h-0 w-full max-w-xl flex-col overflow-hidden bg-[var(--sudoku-shell-bg)] px-1.5 py-1 text-white sm:px-2 sm:py-2">
      <div ref={cardRef} className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sm:p-4">
        <header ref={headerRef} className="shrink-0 text-center">
          <h2 className="font-sans text-sm font-extrabold uppercase tracking-wide text-white sm:text-lg">Sudoku</h2>
          <p className="mt-0.5 text-[11px] text-white/70 sm:mt-1 sm:text-sm">
            Fill each row, column and 3x3 box with digits 1-9.
          </p>
        </header>

        <section ref={boardRegionRef} className="flex min-h-0 flex-1 items-center justify-center py-1.5 sm:py-2">
          <div
            ref={boardGridRef}
            role="application"
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="grid aspect-square h-full max-h-full w-full max-w-[min(88vw,410px)] grid-cols-9 rounded-xl border border-white/25 bg-[var(--sudoku-board-bg)] p-1 outline-none"
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
                      isFixed ? 'bg-[var(--sudoku-cell-fixed)] text-white' : 'bg-[var(--sudoku-cell-editable)] text-[var(--color-accent-primary)]',
                      isSameRow || isSameCol ? 'bg-[var(--sudoku-cell-highlight)]' : '',
                      isSelected ? 'ring-2 ring-inset ring-[var(--color-accent-primary)]' : '',
                      isConflict ? 'bg-[var(--sudoku-conflict-bg)] text-[var(--sudoku-conflict-text)]' : '',
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
        </section>

        <section ref={controlsRef} className="shrink-0 space-y-1.5 sm:space-y-2">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCellValue(num)}
                className="blunno-focus-visible glass-button min-h-[40px] rounded-xl text-sm font-bold text-white sm:min-h-[44px]"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCellValue(0)}
              className="blunno-focus-visible glass-button col-span-2 min-h-[40px] rounded-xl text-[11px] font-bold uppercase tracking-wide text-white/90 sm:min-h-[44px] sm:text-xs"
            >
              Clear cell
            </button>
            <button
              type="button"
              onClick={newPuzzle}
              className="blunno-focus-visible glass-button col-span-3 min-h-[40px] rounded-xl text-[11px] font-bold uppercase tracking-wide text-[var(--color-accent-primary)] sm:min-h-[44px] sm:text-xs"
            >
              New puzzle
            </button>
          </div>

          <div ref={statusRef} className="text-center text-xs font-semibold sm:text-sm">
            {solved ? (
              <p className="text-[var(--color-semantic-success)]">Solved. Great focus.</p>
            ) : conflicts.size > 0 ? (
              <p className="text-[var(--color-semantic-danger)]">There are conflicts in the highlighted cells.</p>
            ) : (
              <p className="text-white/70">Select a cell and use keypad or keyboard (1-9).</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
