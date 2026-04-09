'use client';

import { useEffect, useMemo, useState, type ReactElement } from 'react';

import { audioService } from '@/services/audioService';

type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID = 14;
const INITIAL_SNAKE: Point[] = [
  { x: 6, y: 7 },
  { x: 5, y: 7 },
  { x: 4, y: 7 },
];

function randomFood(snake: Point[]): Point {
  while (true) {
    const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

export function SnakeGame(): ReactElement {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 10, y: 7 });
  const [direction, setDirection] = useState<Direction>('right');
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direction !== 'down') setDirection('up');
      if (e.key === 'ArrowDown' && direction !== 'up') setDirection('down');
      if (e.key === 'ArrowLeft' && direction !== 'right') setDirection('left');
      if (e.key === 'ArrowRight' && direction !== 'left') setDirection('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [direction]);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const next = { ...head };
        if (direction === 'up') next.y -= 1;
        if (direction === 'down') next.y += 1;
        if (direction === 'left') next.x -= 1;
        if (direction === 'right') next.x += 1;

        const out = next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID;
        const hitSelf = prev.some((p) => p.x === next.x && p.y === next.y);

        if (out || hitSelf) {
          setRunning(false);
          void audioService.play('exhale');
          return prev;
        }

        const grown = [next, ...prev];
        if (next.x === food.x && next.y === food.y) {
          setFood(randomFood(grown));
          setScore((s) => s + 1);
          void audioService.play('pop');
          return grown;
        }

        grown.pop();
        return grown;
      });
    }, 180);

    return () => window.clearInterval(id);
  }, [direction, running, food]);

  const cells = useMemo(() => {
    const set = new Set(snake.map((s) => `${s.x}:${s.y}`));
    return Array.from({ length: GRID * GRID }, (_, i) => {
      const x = i % GRID;
      const y = Math.floor(i / GRID);
      const key = `${x}:${y}`;
      const isSnake = set.has(key);
      const isFood = food.x === x && food.y === y;
      return { key, isSnake, isFood };
    });
  }, [snake, food]);

  const restart = () => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection('right');
    setScore(0);
    setRunning(true);
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-white/80">Score: {score}</p>
        {!running && (
          <button
            type="button"
            onClick={restart}
            className="rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-semibold"
          >
            Restart
          </button>
        )}
      </div>

      <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1 rounded-xl bg-black/35 p-2">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={[
              'aspect-square rounded-sm',
              cell.isSnake ? 'bg-[#6EDAE4]' : 'bg-white/10',
              cell.isFood ? '!bg-[#E7B453]' : '',
            ].join(' ')}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <button
          type="button"
          className="rounded-lg border border-white/20 bg-white/10 py-2"
          onClick={() => setDirection((d) => (d === 'down' ? d : 'up'))}
        >
          Up
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/20 bg-white/10 py-2"
          onClick={() => setDirection((d) => (d === 'right' ? d : 'left'))}
        >
          Left
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/20 bg-white/10 py-2"
          onClick={() => setDirection((d) => (d === 'left' ? d : 'right'))}
        >
          Right
        </button>
        <button
          type="button"
          className="col-start-2 rounded-lg border border-white/20 bg-white/10 py-2"
          onClick={() => setDirection((d) => (d === 'up' ? d : 'down'))}
        >
          Down
        </button>
      </div>
    </div>
  );
}
