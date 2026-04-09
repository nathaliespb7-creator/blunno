import { Howl, Howler } from 'howler';

/**
 * Mobile Safari / Chrome require a user gesture before audio; Web Audio may stay
 * suspended until resumed. Use AudioUnlock + unlockAudioSession.
 * html5: true + preload improve MP3 playback on mobile browsers.
 */

let navigationPop: Howl | null = null;
let hoverSoftSound: Howl | null = null;
let inhaleSound: Howl | null = null;
let exhaleSound: Howl | null = null;
let unlocked = false;

const howlOpts = {
  volume: 0.4,
  preload: true as const,
  html5: true as const,
};

/** Warm all app sounds after first user gesture (mobile-friendly). */
function preloadAppSounds(): void {
  if (typeof window === 'undefined') return;
  getHoverSoftSound();
  getInhaleSound();
  getExhaleSound();
}

/** Welcome / route transitions — soft hover cue */
function getHoverSoftSound(): Howl | null {
  if (typeof window === 'undefined') return null;
  if (!hoverSoftSound) {
    hoverSoftSound = new Howl({
      src: ['/sounds/hover-soft.mp3'],
      volume: 0.15,
      rate: 1.2,
      preload: true,
      html5: true,
      onloaderror: (_id, err) => {
        console.warn('[nav] hover-soft.mp3 unavailable:', err);
      },
    });
  }
  return hoverSoftSound;
}

function getNavigationPop(): Howl | null {
  if (typeof window === 'undefined') return null;
  if (!navigationPop) {
    navigationPop = new Howl({
      src: ['/sounds/pop.mp3'],
      ...howlOpts,
      onloaderror: (_id, err) => {
        console.warn('[nav] pop sound unavailable:', err);
      },
    });
  }
  return navigationPop;
}

function getInhaleSound(): Howl | null {
  if (typeof window === 'undefined') return null;
  if (!inhaleSound) {
    inhaleSound = new Howl({
      src: ['/sounds/inhale.mp3'],
      ...howlOpts,
      onloaderror: (_id, err) => {
        console.warn('[planner] inhale.mp3 unavailable:', err);
      },
    });
  }
  return inhaleSound;
}

/** Shared exhale asset (e.g. SOS); same preload/html5 as other app sounds. */
export function getExhaleSound(): Howl | null {
  if (typeof window === 'undefined') return null;
  if (!exhaleSound) {
    exhaleSound = new Howl({
      src: ['/sounds/exhale.mp3'],
      ...howlOpts,
      onloaderror: (_id, err) => {
        console.warn('[sos] exhale.mp3 unavailable:', err);
      },
    });
  }
  return exhaleSound;
}

/** Call on first user interaction so route / task sounds can play on mobile. Idempotent. */
export function unlockAudioSession(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  
  if (unlocked) {
    console.log('[audio] Already unlocked');
    return Promise.resolve();
  }
  
  console.log('[audio] Unlocking audio session...');
  
  return new Promise((resolve) => {
    try {
      // Resume AudioContext if suspended
      const ctx = Howler.ctx;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('[audio] AudioContext resumed');
          completeUnlock();
        }).catch((e) => {
          console.warn('[audio] AudioContext resume failed:', e);
          completeUnlock();
        });
      } else {
        completeUnlock();
      }

      function completeUnlock() {
        // Play silent sound to unlock audio on mobile
        const silentMp3 = 'data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAATM=';
        
        let unlockAttempts = 0;
        const maxAttempts = 3;
        
        function attemptUnlock() {
          unlockAttempts++;
          console.log(`[audio] Unlock attempt ${unlockAttempts}/${maxAttempts}`);
          
          const silentSound = new Howl({
            src: [silentMp3],
            volume: 0,
            html5: true,
            onplay: () => {
              console.log('[audio] Silent Howl played successfully');
              unlocked = true;
              preloadAppSounds();
              resolve();
            },
            onloaderror: () => {
              console.warn('[audio] Silent Howl failed to load');
              tryHtml5Fallback();
            },
            onplayerror: () => {
              console.warn('[audio] Silent Howl failed to play');
              tryHtml5Fallback();
            }
          });
          
          silentSound.play();
          
          // Timeout fallback
          setTimeout(() => {
            if (!unlocked && unlockAttempts < maxAttempts) {
              console.log('[audio] Retrying unlock...');
              attemptUnlock();
            } else if (!unlocked) {
              console.log('[audio] Max attempts reached, marking as unlocked anyway');
              unlocked = true;
              preloadAppSounds();
              resolve();
            }
          }, 200);
        }
        
        function tryHtml5Fallback() {
          try {
            const audio = new Audio(silentMp3);
            audio.volume = 0;
            audio.addEventListener('canplaythrough', () => {
              console.log('[audio] HTML5 Audio ready');
              audio.play().then(() => {
                console.log('[audio] HTML5 Audio played successfully');
                unlocked = true;
                preloadAppSounds();
                resolve();
              }).catch((e) => {
                console.warn('[audio] HTML5 Audio play failed:', e);
                if (unlockAttempts < maxAttempts) {
                  attemptUnlock();
                } else {
                  unlocked = true;
                  preloadAppSounds();
                  resolve();
                }
              });
            });
            audio.load();
          } catch (e) {
            console.warn('[audio] HTML5 Audio creation failed:', e);
            if (unlockAttempts < maxAttempts) {
              attemptUnlock();
            } else {
              unlocked = true;
              preloadAppSounds();
              resolve();
            }
          }
        }
        
        attemptUnlock();
      }
    } catch (e) {
      console.warn('[audio] unlock failed:', e);
      unlocked = true;
      preloadAppSounds();
      resolve();
    }
  });
}

/** Legacy pop (optional); prefer playNavigationHoverSoft for route changes. */
export function playNavigationPop(): void {
  try {
    getNavigationPop()?.play();
  } catch (e) {
    console.warn('[nav] pop play failed:', e);
  }
}

/** Play on every client-side route change — same file as Welcome hover. */
export function playNavigationHoverSoft(): void {
  if (typeof window === 'undefined') return;
  
  console.log('[nav] Attempting to play navigation sound, unlocked:', unlocked);
  
  if (!unlocked) {
    console.warn('[nav] Audio not unlocked yet, skipping sound');
    return;
  }
  
  try {
    const sound = getHoverSoftSound();
    if (sound) {
      console.log('[nav] Playing navigation sound');
      
      // Ensure AudioContext is running
      const ctx = Howler.ctx;
      if (ctx && ctx.state === 'suspended') {
        console.log('[nav] AudioContext suspended, resuming...');
        ctx.resume().then(() => {
          console.log('[nav] AudioContext resumed, playing sound');
          sound.play();
        }).catch((e) => {
          console.warn('[nav] AudioContext resume failed:', e);
          sound.play(); // Try anyway
        });
      } else {
        sound.play();
      }
    } else {
      console.warn('[nav] hover-soft sound not available');
    }
  } catch (e) {
    console.warn('[nav] hover-soft play failed:', e);
  }
}

/** Planner: task marked complete (false → true). Call in the same tick as the user gesture. */
export function playTaskCompleteInhale(): void {
  if (typeof window === 'undefined') return;
  
  // Ensure audio is unlocked before playing
  unlockAudioSession().then(() => {
    try {
      const sound = getInhaleSound();
      if (sound && unlocked) {
        console.log('[planner] Playing task complete sound');
        sound.play();
      } else {
        console.warn('[planner] Inhale sound not available or audio not unlocked');
      }
    } catch (e) {
      console.warn('[planner] inhale play failed:', e);
    }
  }).catch((e) => {
    console.warn('[planner] audio unlock failed:', e);
  });
}
