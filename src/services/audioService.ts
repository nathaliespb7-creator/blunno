import { Howl, Howler } from 'howler';

export type BlunnoSoundName = 'hover-soft' | 'inhale' | 'exhale' | 'success' | 'pop';

const BASE_OPTS = {
  html5: true as const,
  preload: true as const,
};

const SOUND_DEFS: Record<BlunnoSoundName, { src: string; volume: number; rate?: number }> = {
  'hover-soft': { src: '/sounds/hover-soft.mp3', volume: 0.15, rate: 1.2 },
  inhale: { src: '/sounds/inhale.mp3', volume: 0.4 },
  exhale: { src: '/sounds/exhale.mp3', volume: 0.4 },
  // Dedicated success.mp3 is optional; inhale is a safe fallback.
  success: { src: '/sounds/inhale.mp3', volume: 0.4 },
  pop: { src: '/sounds/pop.mp3', volume: 0.4 },
};

class AudioService {
  private unlocked = false;
  private unlockPromise: Promise<void> | null = null;
  private sounds = new Map<BlunnoSoundName, Howl>();

  private getHowl(name: BlunnoSoundName): Howl {
    const cached = this.sounds.get(name);
    if (cached) return cached;

    const def = SOUND_DEFS[name];
    const howl = new Howl({
      src: [def.src],
      volume: def.volume,
      rate: def.rate ?? 1,
      ...BASE_OPTS,
      onloaderror: (_id, err) => {
        console.warn(`[audio] failed loading ${def.src}:`, err);
      },
      onplayerror: (_id, err) => {
        console.warn(`[audio] failed playing ${def.src}:`, err);
      },
    });
    this.sounds.set(name, howl);
    return howl;
  }

  preloadAll(): void {
    if (typeof window === 'undefined') return;
    (Object.keys(SOUND_DEFS) as BlunnoSoundName[]).forEach((name) => {
      this.getHowl(name);
    });
  }

  async ensureUnlocked(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (this.unlocked) return;
    if (this.unlockPromise) return this.unlockPromise;

    this.unlockPromise = (async () => {
      try {
        const ctx = Howler.ctx;
        if (ctx && ctx.state === 'suspended') {
          await ctx.resume();
        }
      } catch (e) {
        console.warn('[audio] AudioContext resume failed:', e);
      }

      // iOS fallback: play a silent howl inside user-gesture call path.
      try {
        const silent = new Howl({
          src: ['data:audio/mp3;base64,SUQzAwAAAAAA'],
          volume: 0,
          html5: true,
          preload: true,
        });
        silent.play();
      } catch {
        // no-op
      }

      this.unlocked = true;
      this.preloadAll();
    })();

    try {
      await this.unlockPromise;
    } finally {
      this.unlockPromise = null;
    }
  }

  async play(name: BlunnoSoundName): Promise<void> {
    if (typeof window === 'undefined') return;
    await this.ensureUnlocked();
    this.getHowl(name).play();
  }
}

export const audioService = new AudioService();
