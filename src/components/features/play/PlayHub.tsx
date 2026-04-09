'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ReactElement } from 'react';

import { BalloonPop } from '@/components/features/play/BalloonPop';
import { SnakeGame } from '@/components/features/play/SnakeGame';
import { SnipperGame } from '@/components/features/play/SnipperGame';
import { audioService } from '@/services/audioService';

type GameKey = 'snake' | 'snipper' | 'balloon';

type GameCard = {
  id: GameKey;
  title: string;
  description: string;
  imageSrc: string;
};

const CARDS: readonly GameCard[] = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Collect treats, grow longer, avoid collisions.',
    imageSrc: '/images/play/snake-preview.png',
  },
  {
    id: 'snipper',
    title: 'Spinner',
    description: 'A calm tactile spinner for quick grounding.',
    imageSrc: '/images/play/spinner-preview.png',
  },
  {
    id: 'balloon',
    title: 'Balloon Pop',
    description: 'Pop balloons before the timer runs out.',
    imageSrc: '/images/play/balloon-preview.png',
  },
] as const;

export function PlayHub(): ReactElement {
  const [selectedGame, setSelectedGame] = useState<GameKey | null>(null);

  const openGame = async (game: GameKey): Promise<void> => {
    await audioService.ensureUnlocked();
    await audioService.play('pop');
    setSelectedGame(game);
  };

  const backToGames = () => {
    setSelectedGame(null);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0D0524] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-welcome text-3xl font-bold tracking-wide text-white md:text-4xl">
            PLAY WITH BLUNNO
          </h1>
          <Link
            href="/choose"
            className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Exit
          </Link>
        </div>

        {selectedGame === null ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  void openGame(card.id);
                }}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-xl backdrop-blur-sm transition-transform hover:scale-[1.02]"
              >
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
                  <Image src={card.imageSrc} alt={`${card.title} preview`} fill className="object-cover" />
                </div>
                <h2 className="text-xl font-bold text-white">{card.title}</h2>
                <p className="mt-1 text-sm text-white/75">{card.description}</p>
              </button>
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
            <button
              type="button"
              onClick={backToGames}
              className="mb-4 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/15"
            >
              ← Back to games
            </button>
            {selectedGame === 'snake' && <SnakeGame />}
            {selectedGame === 'snipper' && <SnipperGame />}
            {selectedGame === 'balloon' && <BalloonPop />}
          </section>
        )}
      </div>
    </main>
  );
}
