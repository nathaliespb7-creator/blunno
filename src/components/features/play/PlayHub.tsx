'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactElement } from 'react';

import { BalloonPop } from '@/components/features/play/BalloonPop';
import { BlunnoTetris } from '@/components/features/play/BlunnoTetris';
import { SudokuGame } from '@/components/features/play/SudokuGame';
import { cn } from '@/lib/utils';
import { audioService } from '@/services/audioService';

type GameKey = 'tetris' | 'sudoku' | 'balloon';

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

export function PlayHub(): ReactElement {
  const [selectedGame, setSelectedGame] = useState<GameKey | null>(null);
  const gameSectionRef = useRef<HTMLElement | null>(null);
  const gameBodyRef = useRef<HTMLDivElement | null>(null);

  const openGame = async (game: GameKey): Promise<void> => {
    await audioService.ensureUnlocked();
    await audioService.play('pop');
    setSelectedGame(game);
  };

  const backToGames = () => {
    setSelectedGame(null);
  };

  const tetrisPixels: ReadonlyArray<readonly [number, number, string]> = [
    [1, 0, 'var(--tetris-piece-1)'],
    [2, 0, 'var(--tetris-piece-1)'],
    [3, 0, 'var(--tetris-piece-1)'],
    [4, 0, 'var(--tetris-piece-1)'],
    [2, 1, 'var(--tetris-piece-6)'],
    [1, 2, 'var(--tetris-piece-6)'],
    [2, 2, 'var(--tetris-piece-6)'],
    [3, 2, 'var(--tetris-piece-6)'],
    [4, 2, 'var(--tetris-piece-3)'],
    [5, 2, 'var(--tetris-piece-3)'],
    [4, 3, 'var(--tetris-piece-3)'],
    [5, 3, 'var(--tetris-piece-3)'],
    [0, 4, 'var(--tetris-piece-5)'],
    [1, 4, 'var(--tetris-piece-5)'],
    [1, 5, 'var(--tetris-piece-5)'],
    [2, 5, 'var(--tetris-piece-5)'],
  ];

  useEffect(() => {
    if (selectedGame !== 'sudoku') return;
    // #region agent log
    const samplePlayHub = (reason: string) => {
      if (!gameSectionRef.current || !gameBodyRef.current) return;
      const section = gameSectionRef.current.getBoundingClientRect();
      const body = gameBodyRef.current.getBoundingClientRect();
      debugLog('sudoku-desktop-overlap', 'H3', 'PlayHub.tsx:samplePlayHub', 'playhub sudoku container sample', {
        reason,
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
        sectionH: Math.round(section.height),
        bodyH: Math.round(body.height),
        sectionOverflowY: window.getComputedStyle(gameSectionRef.current).overflowY,
        bodyOverflowY: window.getComputedStyle(gameBodyRef.current).overflowY,
      });
    };
    samplePlayHub('mount');
    const onResize = () => samplePlayHub('resize');
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // #endregion
  }, [selectedGame]);

  return (
    <main
      className={cn(
        'flex h-dvh min-h-dvh max-h-dvh flex-col overflow-x-hidden',
        selectedGame === null ? 'overflow-y-auto overscroll-y-contain' : 'overflow-y-hidden',
        'bg-blunno-bg text-blunno-foreground',
        selectedGame === null ? 'px-4 py-4 sm:px-5 sm:py-6' : 'px-3 py-2 sm:px-5 sm:py-4',
        '[@media(max-height:620px)]:py-3',
        'pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]'
      )}
    >
      <div
        className={cn(
          'mx-auto flex min-h-0 min-w-0 w-full max-w-4xl flex-1 flex-col items-center justify-center gap-3',
          '[@media(max-height:620px)]:justify-start [@media(max-height:620px)]:gap-2'
        )}
      >
        {selectedGame === null ? (
          <>
            <div className="flex w-full shrink-0 justify-end">
              <Link
                href="/choose"
                aria-label="Exit to mode selection"
                className="blunno-focus-visible blunno-nav-btn text-white/95"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </Link>
            </div>

            <h1
              className={cn(
                'w-full shrink-0 py-2 text-center font-sans text-lg font-extrabold uppercase leading-tight tracking-figma [text-shadow:var(--shadow-text-title)]',
                'sm:text-xl md:text-[22px]',
                '[@media(max-height:620px)]:py-1 [@media(max-height:620px)]:text-base'
              )}
            >
              <span className="text-white">PLAY WITH </span>
              <span className="text-[var(--color-accent-primary)]">BLUNNO</span>
            </h1>

            <div
              className={cn(
                'flex min-h-0 w-full flex-1 flex-col items-center justify-center py-1 [@media(max-height:620px)]:py-0'
              )}
            >
              <div className="grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-3 sm:gap-8">
              <button
                type="button"
                onClick={() => {
                  void openGame('tetris');
                }}
                className="play-game-card flex flex-col items-center rounded-2xl"
                aria-label="Open Tetris game"
              >
                <div className="glass-card flex h-[140px] w-[220px] items-center justify-center rounded-2xl p-3 sm:w-[250px]">
                  <div className="mx-auto grid grid-cols-6 gap-0.5 rounded-sm p-1">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const x = i % 6;
                      const y = Math.floor(i / 6);
                      const active = tetrisPixels.find(([px, py]) => px === x && py === y);
                      return (
                        <div
                          key={`${x}-${y}`}
                          className={[
                            'h-3.5 w-3.5 sm:h-4 sm:w-4',
                            active ? '' : 'bg-transparent',
                          ].join(' ')}
                          style={active ? { backgroundColor: active[2] } : undefined}
                        />
                      );
                    })}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  void openGame('sudoku');
                }}
                className="play-game-card flex flex-col items-center rounded-2xl"
                aria-label="Open Sudoku game"
              >
                <div className="glass-card flex h-[140px] w-[220px] items-center justify-center rounded-2xl p-3 sm:w-[250px]">
                  <div className="grid grid-cols-9 gap-0.5 rounded-lg border border-white/15 bg-[var(--sudoku-board-bg)] p-1">
                    {Array.from({ length: 81 }).map((_, i) => {
                      const row = Math.floor(i / 9);
                      const col = i % 9;
                      const fixed = [0, 1, 4, 9, 10, 13, 20, 27, 32, 36, 40, 44, 48, 52, 58, 67, 70, 79].includes(i);
                      return (
                        <div
                          key={`sudoku-${i}`}
                          className={[
                            'h-1.5 w-1.5 rounded-[1px] sm:h-2 sm:w-2',
                            fixed ? 'bg-[var(--tetris-piece-6)]' : 'bg-[var(--sudoku-cell-editable)]',
                            row % 3 === 0 ? 'ring-1 ring-inset ring-white/10' : '',
                            col % 3 === 0 ? 'ring-1 ring-inset ring-white/10' : '',
                          ].join(' ')}
                        />
                      );
                    })}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  void openGame('balloon');
                }}
                className="play-game-card flex flex-col items-center rounded-2xl"
                aria-label="Open Balloon Pop game"
              >
                <div className="glass-card flex h-[140px] w-[220px] items-center justify-center rounded-2xl p-3 sm:w-[250px]">
                  <Image
                    src="/images/play/balloon-popit.png"
                    alt="Balloon Pop visual"
                    width={320}
                    height={205}
                    className="h-auto w-[160px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] sm:w-[180px]"
                  />
                </div>
              </button>
              </div>
            </div>
          </>
        ) : (
          <section ref={gameSectionRef} className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-x-hidden overflow-y-hidden p-1.5 sm:p-3 [@media(max-height:700px)]:overflow-y-auto [@media(max-height:700px)]:overscroll-y-contain">
            <div className="flex w-full shrink-0 items-center justify-between gap-2">
              <button
                type="button"
                onClick={backToGames}
                className="blunno-focus-visible glass-button w-fit min-h-[44px] rounded-xl px-3 py-2 text-xs font-semibold text-white/95 sm:text-sm"
              >
                ← Back to games
              </button>
              <Link
                href="/choose"
                aria-label="Exit to mode selection"
                className="blunno-focus-visible blunno-nav-btn shrink-0 text-white/95"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </Link>
            </div>
            <div ref={gameBodyRef} className="flex min-h-0 flex-1 w-full flex-col overflow-hidden">
              {selectedGame === 'tetris' && <BlunnoTetris />}
              {selectedGame === 'sudoku' && <SudokuGame />}
              {selectedGame === 'balloon' && <BalloonPop />}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
