import { warmRelaxMediaInCache } from '@/lib/relaxMediaWarmup';
import { DEFAULT_RELAX_VOLUME } from '@/config/relaxSounds';

export type RelaxSoundId = 'birch-wind' | 'ocean' | 'rain' | 'meditation' | 'soft-storm';

type WarmupSound = { id: RelaxSoundId; audioSrc?: string };

const DEFAULT_VOLUME = DEFAULT_RELAX_VOLUME / 100;

class RelaxAudioService {
  private pool = new Map<RelaxSoundId, HTMLAudioElement>();
  private soundVolumes = new Map<RelaxSoundId, number>();
  private activeAudio: HTMLAudioElement | null = null;
  private currentId: RelaxSoundId | null = null;
  private listeners = new Set<(id: RelaxSoundId | null) => void>();
  private playGeneration = 0;

  getActiveId(): RelaxSoundId | null {
    return this.currentId;
  }

  getVolumePercent(id: RelaxSoundId): number {
    return Math.round(this.getVolume(id) * 100);
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

  play(id: RelaxSoundId, src: string, title?: string): void {
    const next = this.getOrCreate(id, src);
    const volume = this.getVolume(id);

    // Same track already playing — just adjust volume
    if (
      this.currentId === id &&
      this.activeAudio === next &&
      !next.paused &&
      !next.ended
    ) {
      this.applyVolume(id, volume);
      return;
    }

    const generation = ++this.playGeneration;

    // Stop previous audio synchronously
    if (this.activeAudio && this.activeAudio !== next) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
    }

    // Set up MediaSession for OS audio priority (iOS requires action handlers)
    if (title && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: 'Blunno', album: 'Relax' });
      navigator.mediaSession.setActionHandler('play', () => this.play(id, src, title));
      navigator.mediaSession.setActionHandler('pause', () => this.stop());
      navigator.mediaSession.playbackState = 'playing';
    }

    this.applyVolume(id, volume);
    next.currentTime = 0;
    this.activeAudio = next;
    this.currentId = id;
    this.emit(id);

    const onPlaying = () => {
      if (generation !== this.playGeneration) return;
      this.applyVolume(id, this.getVolume(id));
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
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
    }
    this.emit(null);
  }

  setVolume(id: RelaxSoundId, v: number): void {
    const clamped = Math.max(0, Math.min(1, v));
    this.soundVolumes.set(id, clamped);
    this.applyVolume(id, clamped);
  }

  private applyVolume(id: RelaxSoundId, volume: number): void {
    const audio = this.pool.get(id);
    if (audio) {
      audio.volume = volume;
    }
  }

  private getVolume(id: RelaxSoundId): number {
    return this.soundVolumes.get(id) ?? DEFAULT_VOLUME;
  }

  private getOrCreate(id: RelaxSoundId, src: string): HTMLAudioElement {
    const absoluteSrc = new URL(src, window.location.origin).href;
    let audio = this.pool.get(id);

    if (!audio) {
      audio = new Audio(absoluteSrc);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.getVolume(id);
      this.pool.set(id, audio);
      return audio;
    }

    if (audio.src !== absoluteSrc) {
      audio.src = absoluteSrc;
    }

    this.applyVolume(id, this.getVolume(id));
    return audio;
  }

  private emit(id: RelaxSoundId | null): void {
    this.currentId = id;
    this.listeners.forEach((l) => l(id));
  }
}

export const relaxAudioService = new RelaxAudioService();
