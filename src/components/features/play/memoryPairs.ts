import { Cloud, Flower2, Heart, Leaf, Moon, Sparkles, type LucideIcon } from 'lucide-react';

export type MemoryPair = {
  id: number;
  label: string;
  accent: string;
  Icon: LucideIcon;
};

export const MEMORY_PAIRS: readonly MemoryPair[] = [
  { id: 0, label: 'Moon', accent: '#8BA3C7', Icon: Moon },
  { id: 1, label: 'Leaf', accent: '#7BA89A', Icon: Leaf },
  { id: 2, label: 'Heart', accent: '#E07A5F', Icon: Heart },
  { id: 3, label: 'Cloud', accent: '#9D84B7', Icon: Cloud },
  { id: 4, label: 'Sparkles', accent: '#D4A373', Icon: Sparkles },
  { id: 5, label: 'Flower', accent: '#C9A0DC', Icon: Flower2 },
] as const;

export const TOTAL_PAIRS = MEMORY_PAIRS.length;
