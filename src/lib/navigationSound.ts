import { audioService } from '@/services/audioService';

/** @deprecated Audio disabled app-wide. Kept for call-site compatibility. */
export function unlockAudioSession(): Promise<void> {
  return audioService.ensureUnlocked();
}

export function playNavigationPop(): void {
  void audioService.play('pop');
}

export function playNavigationHoverSoft(): void {
  void audioService.play('hover-soft');
}

export function playTaskCompleteInhale(): void {
  void audioService.play('success');
}

export function playSosStartChime(): void {
  void audioService.play('sos-start');
}
