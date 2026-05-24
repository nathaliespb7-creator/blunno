export type BlunnoSoundName = 'hover-soft' | 'inhale' | 'exhale' | 'success' | 'pop' | 'sos-start';

const SOUND_SRC: Partial<Record<BlunnoSoundName, string>> = {
  pop: '/audio/pop.mp3',
};

class AudioService {
  private unlocked = false;

  private pool = new Map<BlunnoSoundName, HTMLAudioElement[]>();

  preloadAll(): void {
    if (typeof window === 'undefined') return;

    for (const [name, src] of Object.entries(SOUND_SRC) as [BlunnoSoundName, string][]) {
      if (!this.pool.has(name)) {
        this.pool.set(name, [this.createAudio(src)]);
      }
    }
  }

  async ensureUnlocked(): Promise<void> {
    if (typeof window === 'undefined' || this.unlocked) return;

    this.preloadAll();

    const sample = this.borrow('pop');
    if (!sample) {
      this.unlocked = true;
      return;
    }

    try {
      sample.volume = 0.001;
      await sample.play();
      sample.pause();
      sample.currentTime = 0;
      sample.volume = 1;
      this.unlocked = true;
    } catch {
      /* iOS may block until explicit user gesture */
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
    } catch {
      /* ignore blocked playback */
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
