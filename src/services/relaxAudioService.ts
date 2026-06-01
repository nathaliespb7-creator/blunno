export type RelaxSoundId = 'birch-wind' | 'ocean' | 'rain' | 'meditation' | 'soft-storm';

class RelaxAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentId: RelaxSoundId | null = null;
  private listeners = new Set<(id: RelaxSoundId | null) => void>();
  private volume = 1.0;

  onStateChange(cb: (id: RelaxSoundId | null) => void): () => void {
    this.listeners.add(cb);
    cb(this.currentId);
    return () => this.listeners.delete(cb);
  }

  play(id: RelaxSoundId, src: string): void {
    this.stop();
    const a = new Audio(src);
    a.loop = true;
    a.volume = this.volume;
    a.preload = 'auto';
    this.audio = a;

    const p = a.play();
    if (p !== undefined) {
      p
        .then(() => this.emit(id))
        .catch((e) => {
          console.warn('[Relax] play blocked:', e);
          this.cleanup();
          this.emit(null);
        });
    } else {
      this.emit(id);
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }
    this.currentId = null;
    this.emit(null);
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio) this.audio.volume = this.volume;
  }

  private emit(id: RelaxSoundId | null): void {
    this.currentId = id;
    this.listeners.forEach((l) => l(id));
  }

  private cleanup(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.src = '';
    this.audio.load();
    this.audio = null;
  }
}

export const relaxAudioService = new RelaxAudioService();
