'use client';

import { ChevronLeft, Copy, Grid3X3, Grip, Home, LayoutGrid, Play, Shapes } from 'lucide-react';
import { useState, useEffect, type ReactElement } from 'react';

import { BalloonPop } from '@/components/features/play/BalloonPop';
import { BlunnoTetris } from '@/components/features/play/BlunnoTetris';
import { MemoryMatchGame } from '@/components/features/play/MemoryMatchGame';
import { SlidePuzzleGame } from '@/components/features/play/SlidePuzzleGame';
import { SudokuGame } from '@/components/features/play/SudokuGame';
import { GlassIconButton } from '@/components/shared/make-v81/GlassIconButton';
import { GlassListCell, GlassListCellAction } from '@/components/shared/make-v81/GlassListCell';
import { GradientTitle } from '@/components/shared/make-v81/GradientTitle';
import { ModeScreenTopBar } from '@/components/shared/make-v81/ModeScreenTopBar';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';

type GameKey = 'tetris' | 'sudoku' | 'balloon' | 'memory' | 'slide';

type GameCard = {
  id: GameKey;
  title: string;
  subtitle: string;
  themeColor: string;
  icon: typeof Grid3X3;
};

const GAMES: GameCard[] = [
  {
    id: 'sudoku',
    title: 'Sudoku',
    subtitle: 'Logic & Focus',
    themeColor: '#7BA89A',
    icon: Grid3X3,
  },
  {
    id: 'tetris',
    title: 'Tetris',
    subtitle: 'Spatial Flow',
    themeColor: '#9D84B7',
    icon: Shapes,
  },
  {
    id: 'balloon',
    title: 'Pop It',
    subtitle: 'Tactile Relief',
    themeColor: '#E07A5F',
    icon: Grip,
  },
  {
    id: 'memory',
    title: 'Memory Match',
    subtitle: 'Memory & Calm',
    themeColor: '#8BA3C7',
    icon: Copy,
  },
  {
    id: 'slide',
    title: 'Slide Puzzle',
    subtitle: 'Order & Clarity',
    themeColor: '#D4A373',
    icon: LayoutGrid,
  },
];

export function PlayHub(): ReactElement {
  const [selectedGame, setSelectedGame] = useState<GameKey | null>(null);

  // Sync state with browser history to handle system back gesture cleanly
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.game) {
        setSelectedGame(e.state.game as GameKey);
      } else {
        setSelectedGame(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const openGame = (game: GameKey): void => {
    setSelectedGame(game);
    // Push virtual state to history so back gesture closes the game instead of leaving /play
    window.history.pushState({ game }, '');
  };

  const backToGames = () => {
    // Triggers popstate which sets selectedGame to null
    window.history.back();
  };

  if (selectedGame !== null) {
    const isPopIt = selectedGame === 'balloon';

    return (
      <ScreenFrame className={isPopIt ? 'v81-screen--play-game v81-screen--play-game-popit' : '!overflow-y-auto'}>
        <div className="v81-top-bar">
          <GlassIconButton icon={ChevronLeft} label="Back to games" onClick={backToGames} />
          <GradientTitle size="md">{GAMES.find((g) => g.id === selectedGame)?.title ?? 'Game'}</GradientTitle>
          <GlassIconButton href="/choose" icon={Home} label="Exit to mode selection" />
        </div>
        <div
          className={
            isPopIt
              ? 'v81-play-game-shell flex min-h-0 flex-1 flex-col overflow-hidden pb-4'
              : 'v81-scroll-area flex min-h-0 flex-1 flex-col pb-4'
          }
        >
          {selectedGame === 'tetris' && <BlunnoTetris />}
          {selectedGame === 'sudoku' && <SudokuGame />}
          {selectedGame === 'balloon' && <BalloonPop />}
          {selectedGame === 'memory' && <MemoryMatchGame />}
          {selectedGame === 'slide' && <SlidePuzzleGame />}
        </div>
      </ScreenFrame>
    );
  }

  return (
      <ScreenFrame className="v81-screen--play">
      <ModeScreenTopBar
        title="Mini Games"
        backHref="/choose"
        backLabel="Back"
        homeHref="/choose"
        homeLabel="Exit to mode selection"
      />

      <p className="v81-play-intro">Take a moment to unwind with a quick session.</p>

      <div className="v81-glass-cell-list v81-glass-cell-list--centered" data-testid="play-game-grid">
        {GAMES.map((game, index) => (
          <GlassListCell
            key={game.id}
            as="div"
            accentColor={game.themeColor}
            title={game.title}
            subtitle={game.subtitle}
            subtitleVariant="category"
            titleAs="h3"
            icon={game.icon}
            animationDelay={`${0.1 + index * 0.1}s`}
            trailing={
              <GlassListCellAction
                icon={Play}
                label="Play"
                onClick={() => openGame(game.id)}
                accentColor={game.themeColor}
                filled
              />
            }
          />
        ))}
      </div>
    </ScreenFrame>
  );
}
