import { audioService } from '@/services/audioService';

/** @deprecated Audio disabled app-wide. Kept for call-site compatibility. */
export async function unlockAudioSession(): Promise<void> {
  await audioService.ensureUnlocked();
}

export function playNavigationPop(): void {
  /* Pop sound is reserved for Pop It bubble taps only */
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
