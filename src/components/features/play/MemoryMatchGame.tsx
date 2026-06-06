'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement } from 'react';

import { MEMORY_PAIRS, TOTAL_PAIRS } from '@/components/features/play/memoryPairs';
import { PlayGameShell } from '@/components/features/play/PlayGameShell';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

type CardState = 'faceDown' | 'faceUp' | 'matched';

type Card = {
  id: number;
  pairId: number;
  state: CardState;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function createDeck(): Card[] {
  const pairs = MEMORY_PAIRS.flatMap((pair) => [
    { pairId: pair.id },
    { pairId: pair.id },
  ]);

  return shuffle(pairs).map((pair, id) => ({
    id,
    pairId: pair.pairId,
    state: 'faceDown' as const,
  }));
}

export function MemoryMatchGame(): ReactElement {
  const { t } = useTranslation();
  const [deck, setDeck] = useState<Card[]>(() => createDeck());
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockedRef = useRef(false);
  const flippedIdsRef = useRef<number[]>([]);

  const pairsFound = useMemo(() => deck.filter((card) => card.state === 'matched').length / 2, [deck]);
  const allMatched = pairsFound >= TOTAL_PAIRS;

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearResetTimer(), [clearResetTimer]);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    flippedIdsRef.current = flippedIds;
  }, [flippedIds]);

  const restart = useCallback(() => {
    clearResetTimer();
    lockedRef.current = false;
    flippedIdsRef.current = [];
    setDeck(createDeck());
    setFlippedIds([]);
    setLocked(false);
  }, [clearResetTimer]);

  const flipCard = useCallback(
    (cardId: number) => {
      if (lockedRef.current || allMatched) return;
      if (flippedIdsRef.current.includes(cardId) || flippedIdsRef.current.length >= 2) return;

      const nextFlipped = [...flippedIdsRef.current, cardId];
      flippedIdsRef.current = nextFlipped;

      setDeck((prev) => {
        const target = prev.find((card) => card.id === cardId);
        if (!target || target.state !== 'faceDown') return prev;
        return prev.map((card) => (card.id === cardId ? { ...card, state: 'faceUp' } : card));
      });

      setFlippedIds(nextFlipped);

      if (nextFlipped.length < 2) return;

      lockedRef.current = true;
      setLocked(true);
      clearResetTimer();

      resetTimerRef.current = setTimeout(() => {
        setDeck((currentDeck) => {
          const [firstId, secondId] = nextFlipped;
          const first = currentDeck.find((card) => card.id === firstId);
          const second = currentDeck.find((card) => card.id === secondId);

          if (!first || !second) return currentDeck;

          if (first.pairId === second.pairId) {
            return currentDeck.map((card) =>
              card.id === firstId || card.id === secondId ? { ...card, state: 'matched' } : card
            );
          }

          return currentDeck.map((card) =>
            card.id === firstId || card.id === secondId ? { ...card, state: 'faceDown' } : card
          );
        });

        flippedIdsRef.current = [];
        lockedRef.current = false;
        setFlippedIds([]);
        setLocked(false);
        resetTimerRef.current = null;
      }, 600);
    },
    [allMatched, clearResetTimer]
  );

  const status = allMatched ? t('play.memory.allMatched') : t('play.memory.findPairs');

  return (
    <PlayGameShell
      testId="memory-game"
      scoreTestId="memory-score"
      fieldTestId="memory-grid"
      scoreLabel={t('play.pairsCount', { found: pairsFound, total: TOTAL_PAIRS })}
      status={status}
      showRestart={allMatched}
      onRestart={restart}
    >
      <div className="grid w-full max-w-[18rem] grid-cols-4 gap-2 sm:max-w-[20rem] sm:gap-2.5">
        {deck.map((card) => {
          const pair = MEMORY_PAIRS[card.pairId];
          const pairLabel = t(`play.memory.pair.${card.pairId}` as 'play.memory.pair.0');
          const isFaceUp = card.state === 'faceUp' || card.state === 'matched';
          const PairIcon = pair.Icon;
          const faceStyle = isFaceUp
            ? ({ '--memory-accent': pair.accent } as CSSProperties)
            : undefined;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flipCard(card.id)}
              disabled={locked || card.state === 'matched' || card.state === 'faceUp'}
              className={cn(
                'memory-card',
                card.state === 'faceDown' && 'memory-card--face-down',
                isFaceUp && 'memory-card--face-up',
                card.state === 'matched' && 'memory-card--matched'
              )}
              style={faceStyle}
              aria-label={isFaceUp ? t('play.memory.card', { label: pairLabel }) : t('play.memory.faceDown')}
              aria-pressed={isFaceUp}
            >
              {isFaceUp && (
                <span className="memory-card__face">
                  <PairIcon className="memory-card__icon" aria-hidden />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </PlayGameShell>
  );
}
