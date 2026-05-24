import { CloudLightning, CloudRain, Sparkles, Waves, Wind, type LucideIcon } from 'lucide-react';

export type RelaxSoundId =
  | 'birch-wind'
  | 'ocean'
  | 'rain'
  | 'meditation'
  | 'soft-storm';

export type RelaxSound = {
  id: RelaxSoundId;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  /** Public path under /audio/relax — omit until asset is added */
  audioSrc?: string;
};

export const RELAX_SOUNDS: readonly RelaxSound[] = [
  {
    id: 'birch-wind',
    name: 'Birch Wind',
    icon: Wind,
    color: '#9CAF88',
    description: 'Wind through white birch trees',
    audioSrc: '/audio/relax/birch-wind.mp3',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    icon: Waves,
    color: '#7BA89A',
    description: 'Gentle ocean sounds',
    audioSrc: '/audio/relax/ocean.mp3',
  },
  {
    id: 'rain',
    name: 'Rain Sounds',
    icon: CloudRain,
    color: '#8BA3C7',
    description: 'Morning rain with birds',
    audioSrc: '/audio/relax/rain.mp3',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    icon: Sparkles,
    color: '#9D84B7',
    description: 'Calming music',
    audioSrc: '/audio/relax/meditation.mp3',
  },
  {
    id: 'soft-storm',
    name: 'Soft Storm',
    icon: CloudLightning,
    color: '#6B8FA8',
    description: 'Distant rain and soft thunder',
    audioSrc: '/audio/relax/soft-storm.mp3',
  },
] as const;

export const DEFAULT_RELAX_VOLUME = 70;

export function defaultRelaxVolumes(): Record<RelaxSoundId, number> {
  return RELAX_SOUNDS.reduce(
    (acc, sound) => {
      acc[sound.id] = DEFAULT_RELAX_VOLUME;
      return acc;
    },
    {} as Record<RelaxSoundId, number>
  );
}
