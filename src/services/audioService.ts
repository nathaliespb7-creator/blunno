/** Pop It bubble pop — only game sound in Blunno (Relax uses relaxAudioService). */
export type BlunnoSoundName = 'pop';

const POP_SRC = '/audio/pop.mp3';

function logPlaybackIssue(error: unknown): void {
  if (process.env.NODE_ENV !== 'development') return;

  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[audioService] playback blocked for "pop": ${message}`);
}

class AudioService {
  private unlocked = false;

  private pool: HTMLAudioElement[] = [];

  isUnlocked(): boolean {
    return this.unlocked;
  }

  private preloadPop(): void {
    if (typeof window === 'undefined') return;
    if (this.pool.length > 0) return;
    this.pool.push(this.createAudio(POP_SRC));
  }

  async ensureUnlocked(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (this.unlocked) return true;

    this.preloadPop();
    const sample = this.borrowPop();
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
      logPlaybackIssue(error);
      return false;
    }
  }

  async play(name: BlunnoSoundName): Promise<void> {
    if (typeof window === 'undefined' || name !== 'pop') return;

    this.preloadPop();
    const audio = this.borrowPop();
    if (!audio) return;

    try {
      audio.currentTime = 0;
      audio.volume = 0.85;
      await audio.play();
    } catch (error) {
      logPlaybackIssue(error);
    }
  }

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = 'auto';
    return audio;
  }

  private borrowPop(): HTMLAudioElement | null {
    const idle = this.pool.find((item) => item.paused || item.ended);
    const audio = idle ?? this.createAudio(POP_SRC);

    if (!this.pool.includes(audio)) {
      this.pool.push(audio);
    }

    return audio;
  }
}

export const audioService = new AudioService();
