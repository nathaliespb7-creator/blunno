import { warmRelaxMediaInCache } from '@/lib/relaxMediaWarmup';

export type RelaxSoundId = 'birch-wind' | 'ocean' | 'rain' | 'meditation' | 'soft-storm';

type WarmupSound = { id: RelaxSoundId; audioSrc?: string };

class RelaxAudioService {
  private pool = new Map<RelaxSoundId, HTMLAudioElement>();
  private activeAudio: HTMLAudioElement | null = null;
  private currentId: RelaxSoundId | null = null;
  private listeners = new Set<(id: RelaxSoundId | null) => void>();
  private volume = 1.0;
  /** Bumped on stop/play to ignore stale async play() resolutions (iOS rapid taps). */
  private playGeneration = 0;

  getActiveId(): RelaxSoundId | null {
    return this.currentId;
  }

  onStateChange(cb: (id: RelaxSoundId | null) => void): () => void {
    this.listeners.add(cb);
    cb(this.currentId);
    return () => this.listeners.delete(cb);
  }

  warmup(sounds: readonly WarmupSound[]): void {
    if (typeof window === 'undefined') return;

    const urls: string[] = [];
    for (const sound of sounds) {
      if (!sound.audioSrc) continue;
      this.getOrCreate(sound.id, sound.audioSrc);
      urls.push(sound.audioSrc);
    }

    void warmRelaxMediaInCache(urls);
  }

  play(id: RelaxSoundId, src: string): void {
    if (this.currentId === id && this.activeAudio && !this.activeAudio.paused && !this.activeAudio.ended) {
      this.activeAudio.volume = this.volume;
      return;
    }

    const generation = ++this.playGeneration;
    this.emit(id);

    const next = this.getOrCreate(id, src);

    if (this.activeAudio && this.activeAudio !== next) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
    }

    next.volume = this.volume;
    next.currentTime = 0;
    this.activeAudio = next;

    const onPlaying = () => {
      if (generation !== this.playGeneration) return;
      this.currentId = id;
      this.emit(id);
    };

    const onPlayFailed = (e: unknown) => {
      if (generation !== this.playGeneration) return;
      console.warn('[Relax] play blocked:', e);
      if (this.activeAudio === next) {
        this.activeAudio = null;
      }
      this.currentId = null;
      this.emit(null);
    };

    const promise = next.play();
    if (promise !== undefined) {
      void promise.then(onPlaying).catch(onPlayFailed);
    } else {
      onPlaying();
    }
  }

  stop(): void {
    this.playGeneration += 1;
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
    }
    this.activeAudio = null;
    this.currentId = null;
    this.emit(null);
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.activeAudio) this.activeAudio.volume = this.volume;
  }

  private getOrCreate(id: RelaxSoundId, src: string): HTMLAudioElement {
    const absoluteSrc = new URL(src, window.location.origin).href;
    let audio = this.pool.get(id);

    if (!audio) {
      audio = new Audio(absoluteSrc);
      audio.loop = true;
      audio.preload = 'auto';
      this.pool.set(id, audio);
      return audio;
    }

    if (audio.src !== absoluteSrc) {
      audio.src = absoluteSrc;
    }

    return audio;
  }

  private emit(id: RelaxSoundId | null): void {
    this.currentId = id;
    this.listeners.forEach((l) => l(id));
  }
}

export const relaxAudioService = new RelaxAudioService();
