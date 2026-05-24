import type { MoodTileConfig } from '@/components/shared/make-v81/MoodTile';

export const V81_MOODS: readonly MoodTileConfig[] = [
  {
    id: 'sos',
    label: 'SOS',
    description: 'Immediate support for anxiety & stress',
    borderColor: '#E07A5F',
    borderGradient: 'linear-gradient(135deg, #E89A85 0%, #E07A5F 50%, #C86A50 100%)',
  },
  {
    id: 'planner',
    label: 'PLANNER',
    description: 'Organize your thoughts and daily tasks',
    borderColor: '#7BA89A',
    borderGradient: 'linear-gradient(135deg, #8BB8AA 0%, #7BA89A 50%, #6B9080 100%)',
  },
  {
    id: 'play',
    label: 'PLAY',
    description: 'Spark joy and creative energy',
    borderColor: '#9D84B7',
    borderGradient: 'linear-gradient(135deg, #AD95C7 0%, #9D84B7 50%, #8A73A5 100%)',
  },
  {
    id: 'relax',
    label: 'RELAX',
    description: 'Unwind and find inner peace',
    borderColor: '#D4A373',
    borderGradient: 'linear-gradient(135deg, #E0B488 0%, #D4A373 50%, #C19563 100%)',
  },
] as const;

export const MOOD_HREFS: Record<string, string> = {
  sos: '/sos',
  planner: '/planner',
  play: '/play',
  relax: '/relax',
};
