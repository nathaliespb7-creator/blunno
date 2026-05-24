export type BlunnoSoundName = 'hover-soft' | 'inhale' | 'exhale' | 'success' | 'pop' | 'sos-start';

const SOUND_SRC: Partial<Record<BlunnoSoundName, string>> = {
  pop: '/audio/pop.mp3',
};

function logPlaybackIssue(name: BlunnoSoundName, error: unknown): void {
  if (process.env.NODE_ENV !== 'development') return;

  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[audioService] playback blocked for "${name}": ${message}`);
}

class AudioService {
  private unlocked = false;

  private pool = new Map<BlunnoSoundName, HTMLAudioElement[]>();

  isUnlocked(): boolean {
    return this.unlocked;
  }

  preloadAll(): void {
    if (typeof window === 'undefined') return;

    for (const [name, src] of Object.entries(SOUND_SRC) as [BlunnoSoundName, string][]) {
      if (!this.pool.has(name)) {
        this.pool.set(name, [this.createAudio(src)]);
      }
    }
  }

  async ensureUnlocked(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (this.unlocked) return true;

    this.preloadAll();

    const sample = this.borrow('pop');
    if (!sample) {
      this.unlocked = true;
      return true;
    }

    try {
      sample.volume = 0.001;
      await sample.play();
      sample.pause();
      sample.currentTime = 0;
      sample.volume = 1;
      this.unlocked = true;
      return true;
    } catch (error) {
      logPlaybackIssue('pop', error);
      return false;
    }
  }

  async play(name: BlunnoSoundName): Promise<void> {
    if (typeof window === 'undefined') return;

    const src = SOUND_SRC[name];
    if (!src) return;

    this.preloadAll();
    const audio = this.borrow(name);
    if (!audio) return;

    try {
      audio.currentTime = 0;
      audio.volume = name === 'pop' ? 0.85 : 1;
      await audio.play();
    } catch (error) {
      logPlaybackIssue(name, error);
    }
  }

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = 'auto';
    return audio;
  }

  private borrow(name: BlunnoSoundName): HTMLAudioElement | null {
    const src = SOUND_SRC[name];
    if (!src) return null;

    const list = this.pool.get(name) ?? [];
    const idle = list.find((item) => item.paused || item.ended);
    const audio = idle ?? this.createAudio(src);

    if (!list.includes(audio)) {
      list.push(audio);
      this.pool.set(name, list);
    }

    return audio;
  }
}

export const audioService = new AudioService();
