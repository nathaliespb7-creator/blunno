'use client';

import { ChevronLeft, Copy, Grid3X3, Grip, Home, LayoutGrid, Play, Shapes } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';

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
import { useTranslation } from '@/i18n/useTranslation';
import { trackEvent } from '@/lib/analytics';

type GameKey = 'tetris' | 'sudoku' | 'balloon' | 'memory' | 'slide';

type GameCard = {
  id: GameKey;
  themeColor: string;
  icon: typeof Grid3X3;
};

const GAMES: GameCard[] = [
  {
    id: 'sudoku',
    themeColor: '#7BA89A',
    icon: Grid3X3,
  },
  {
    id: 'tetris',
    themeColor: '#9D84B7',
    icon: Shapes,
  },
  {
    id: 'balloon',
    themeColor: '#E07A5F',
    icon: Grip,
  },
  {
    id: 'memory',
    themeColor: '#8BA3C7',
    icon: Copy,
  },
  {
    id: 'slide',
    themeColor: '#D4A373',
    icon: LayoutGrid,
  },
];

export function PlayHub(): ReactElement {
  const { t } = useTranslation();
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
    trackEvent('play_game_open', { game_id: game });
    setSelectedGame(game);
    // Push virtual state to history so back gesture closes the game instead of leaving /play
    window.history.pushState({ game }, '');
  };

  const backToGames = () => {
    // #region agent log
    fetch('http://127.0.0.1:7876/ingest/c382d466-b827-4be9-8387-43085e568544',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'127c83'},body:JSON.stringify({sessionId:'127c83',location:'PlayHub.tsx:backToGames',message:'instant back to games hub',data:{game:selectedGame,t:performance.now()},timestamp:Date.now(),hypothesisId:'B',runId:'post-fix'})}).catch(()=>{});
    // #endregion
    setSelectedGame(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  if (selectedGame !== null) {
    const isPopIt = selectedGame === 'balloon';
    const gameTitle = t(`play.${selectedGame}` as any);

    return (
      <ScreenFrame className={isPopIt ? 'v81-screen--play-game v81-screen--play-game-popit' : '!overflow-y-auto'}>
        <div className="v81-top-bar">
          <GlassIconButton icon={ChevronLeft} label={t('play.backToGames')} onClick={backToGames} />
          <GradientTitle size="md">{gameTitle}</GradientTitle>
          <GlassIconButton href="/choose" icon={Home} label={t('nav.exit')} />
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
        title={t('play.title')}
        backHref="/choose"
        backLabel={t('nav.back')}
        homeHref="/choose"
        homeLabel={t('nav.exit')}
      />

      <p className="v81-play-intro">{t('play.subtitle')}</p>

      <div className="v81-glass-cell-list v81-glass-cell-list--centered" data-testid="play-game-grid">
        {GAMES.map((game, index) => (
          <GlassListCell
            key={game.id}
            as="div"
            accentColor={game.themeColor}
            title={t(`play.${game.id}` as any)}
            subtitle={t(`play.${game.id}.desc` as any)}
            subtitleVariant="category"
            titleAs="h3"
            icon={game.icon}
            animationDelay={`${0.1 + index * 0.1}s`}
            trailing={
              <GlassListCellAction
                icon={Play}
                label={t('play.actionPlay')}
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
