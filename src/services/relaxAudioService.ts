import type { RelaxSoundId } from '@/config/relaxSounds';

class RelaxAudioService {
  private audio: HTMLAudioElement | null = null;

  private context: AudioContext | null = null;

  private gain: GainNode | null = null;

  private source: MediaElementAudioSourceNode | null = null;

  private currentId: RelaxSoundId | null = null;

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
    }
    return this.context;
  }

  async play(id: RelaxSoundId, src: string, volumePercent: number): Promise<void> {
    if (typeof window === 'undefined') return;

    if (this.currentId !== id || !this.audio) {
      this.teardownPlayback();

      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = 'auto';

      const ctx = this.ensureContext();
      const source = ctx.createMediaElementSource(audio);
      const gain = ctx.createGain();
      source.connect(gain);
      gain.connect(ctx.destination);

      this.audio = audio;
      this.source = source;
      this.gain = gain;
      this.currentId = id;
    }

    this.applyVolume(volumePercent);

    try {
      if (this.context?.state === 'suspended') {
        await this.context.resume();
      }
      await this.audio.play();
    } catch {
      /* Browser may block autoplay until user gesture — UI state still reflects selection */
    }
  }

  setVolume(volumePercent: number): void {
    this.applyVolume(volumePercent);
  }

  private applyVolume(volumePercent: number): void {
    const normalized = Math.min(1, Math.max(0, volumePercent / 100));
    if (this.gain) {
      this.gain.gain.value = normalized;
      return;
    }
    if (this.audio) {
      this.audio.volume = normalized;
    }
  }

  private teardownPlayback(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
    }
    this.source?.disconnect();
    this.gain?.disconnect();
    this.audio = null;
    this.source = null;
    this.gain = null;
    this.currentId = null;
  }

  stop(): void {
    this.teardownPlayback();
  }

  getCurrentId(): RelaxSoundId | null {
    return this.currentId;
  }
}

export const relaxAudioService = new RelaxAudioService();
