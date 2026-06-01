export type RelaxSoundId = 'birch-wind' | 'ocean' | 'rain' | 'meditation' | 'soft-storm';

class RelaxAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentId: RelaxSoundId | null = null;
  private listeners = new Set<(id: RelaxSoundId | null) => void>();
  private volume = 1.0;
  /** Bumped on stop/play to ignore stale async play() resolutions (iOS rapid taps). */
  private playGeneration = 0;
  /** Restore position when the same track is restarted after a race or quick toggle. */
  private resumeTimeById = new Map<RelaxSoundId, number>();

  onStateChange(cb: (id: RelaxSoundId | null) => void): () => void {
    this.listeners.add(cb);
    cb(this.currentId);
    return () => this.listeners.delete(cb);
  }

  play(id: RelaxSoundId, src: string): void {
    if (this.currentId === id && this.audio && !this.audio.paused && !this.audio.ended) {
      this.audio.volume = this.volume;
      return;
    }

    const generation = ++this.playGeneration;
    this.detachAudio();

    const a = new Audio(src);
    a.loop = true;
    a.volume = this.volume;
    a.preload = 'auto';

    const resumeAt = this.resumeTimeById.get(id);
    if (resumeAt !== undefined && resumeAt > 0) {
      const applyResume = () => {
        if (generation !== this.playGeneration || this.audio !== a) return;
        try {
          a.currentTime = resumeAt;
        } catch {
          /* duration unknown until metadata — ignore */
        }
      };
      if (a.readyState >= 1) {
        applyResume();
      } else {
        a.addEventListener('loadedmetadata', applyResume, { once: true });
      }
    }

    this.audio = a;

    const onPlaying = () => {
      if (generation !== this.playGeneration) {
        this.disposeElement(a);
        return;
      }
      this.currentId = id;
      this.emit(id);
    };

    const onPlayFailed = (e: unknown) => {
      if (generation !== this.playGeneration) return;
      console.warn('[Relax] play blocked:', e);
      this.detachAudio();
      this.emit(null);
    };

    const promise = a.play();
    if (promise !== undefined) {
      void promise.then(onPlaying).catch(onPlayFailed);
    } else {
      onPlaying();
    }
  }

  stop(): void {
    if (this.currentId && this.audio) {
      const t = this.audio.currentTime;
      if (Number.isFinite(t) && t > 0) {
        this.resumeTimeById.set(this.currentId, t);
      }
    }
    this.playGeneration += 1;
    this.detachAudio();
    this.currentId = null;
    this.emit(null);
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio) this.audio.volume = this.volume;
  }

  private detachAudio(): void {
    if (!this.audio) return;
    this.disposeElement(this.audio);
    this.audio = null;
  }

  private disposeElement(a: HTMLAudioElement): void {
    a.pause();
    a.removeAttribute('src');
    try {
      a.load();
    } catch {
      /* iOS may throw if already torn down */
    }
  }

  private emit(id: RelaxSoundId | null): void {
    this.currentId = id;
    this.listeners.forEach((l) => l(id));
  }
}

export const relaxAudioService = new RelaxAudioService();
