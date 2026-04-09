import { audioService } from '@/services/audioService';

/** Call on first user interaction so route / task sounds can play on mobile. Idempotent. */
export function unlockAudioSession(): Promise<void> {
  return audioService.ensureUnlocked();
}

/** Legacy pop (optional). */
export function playNavigationPop(): void {
  void audioService.play('pop');
}

/** Play on every client-side route change — same file as Welcome hover. */
export function playNavigationHoverSoft(): void {
  void audioService.play('hover-soft');
}

/** Planner: task marked complete (false → true). */
export function playTaskCompleteInhale(): void {
  void audioService.play('success');
}

/** Shared exhale trigger (SOS). */
export function playSosExhale(): void {
  void audioService.play('exhale');
}
