'use client';

import { Pause, Play, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useState, type ReactElement } from 'react';

import {
  DEFAULT_RELAX_VOLUME,
  RELAX_SOUNDS,
  defaultRelaxVolumes,
  type RelaxSound,
} from '@/config/relaxSounds';
import { GlassListCell, GlassListCellAction } from '@/components/shared/make-v81/GlassListCell';
import { ModeScreenTopBar } from '@/components/shared/make-v81/ModeScreenTopBar';
import { ScreenFrame } from '@/components/shared/make-v81/ScreenFrame';
import { trackEvent } from '@/lib/analytics';
import { relaxAudioService, type RelaxSoundId } from '@/services/relaxAudioService';

export default function RelaxPage(): ReactElement {
  const [activeSound, setActiveSound] = useState<RelaxSoundId | null>(null);
  const [volumes, setVolumes] = useState<Record<RelaxSoundId, number>>(defaultRelaxVolumes);

  useEffect(() => {
    relaxAudioService.warmup(RELAX_SOUNDS);
    return relaxAudioService.onStateChange(setActiveSound);
  }, []);

  const toggleSound = useCallback(
    (sound: RelaxSound) => {
      const playingId = relaxAudioService.getActiveId();
      if (playingId === sound.id) {
        trackEvent('relax_pause', { sound_id: sound.id, sound_name: sound.name });
        relaxAudioService.stop();
        return;
      }

      if (!sound.audioSrc) return;

      const volumePercent = volumes[sound.id] ?? DEFAULT_RELAX_VOLUME;
      relaxAudioService.setVolume(sound.id, volumePercent / 100);
      relaxAudioService.play(sound.id, sound.audioSrc);
      trackEvent('relax_play', { sound_id: sound.id, sound_name: sound.name });
    },
    [volumes]
  );

  const updateVolume = (id: RelaxSoundId, value: number) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
    relaxAudioService.setVolume(id, value / 100);
  };

  return (
    <ScreenFrame glowVariant="relax" className="v81-screen--relax">
      <ModeScreenTopBar
        title="Relax"
        backHref="/choose"
        backLabel="Back to mode selection"
        homeHref="/choose"
        homeLabel="Exit to mode selection"
      />

      <p className="v81-relax-intro">Choose your calming sound</p>

      <div className="v81-scroll-area v81-glass-cell-list v81-glass-cell-list--centered pb-4" data-testid="relax-sound-list">
        {RELAX_SOUNDS.map((sound, index) => {
          const isActive = activeSound === sound.id;
          const volume = volumes[sound.id];
          const Icon = sound.icon;
          const hasAudio = Boolean(sound.audioSrc);

          return (
            <GlassListCell
              key={sound.id}
              as="div"
              accentColor={sound.color}
              title={sound.name}
              subtitle={hasAudio ? sound.description : `${sound.description} · coming soon`}
              subtitleVariant="description"
              icon={Icon}
              animationDelay={`${0.05 + index * 0.05}s`}
              footer={
                isActive ? (
                  <div className="v81-relax-volume">
                    <Volume2 className="h-[18px] w-[18px] shrink-0 text-white/50" strokeWidth={2} />
                    <div className="v81-relax-volume-track">
                      <div className="v81-relax-volume-rail" aria-hidden />
                      <div
                        className="v81-relax-volume-fill"
                        style={{
                          width: `${volume}%`,
                          background: `linear-gradient(90deg, ${sound.color}80 0%, ${sound.color}50 100%)`,
                          boxShadow: `0 0 10px ${sound.color}60`,
                        }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onInput={(e) => updateVolume(sound.id, Number(e.currentTarget.value))}
                        onChange={(e) => updateVolume(sound.id, Number(e.currentTarget.value))}
                        className="v81-relax-volume-input"
                        aria-label={`${sound.name} volume`}
                      />
                    </div>
                    <span className="min-w-[36px] shrink-0 text-right text-[13px] font-semibold text-white/60">
                      {volume}%
                    </span>
                  </div>
                ) : undefined
              }
              trailing={
                <GlassListCellAction
                  icon={isActive ? Pause : Play}
                  label={isActive ? `Pause ${sound.name}` : `Play ${sound.name}`}
                  onClick={() => toggleSound(sound)}
                  accentColor={sound.color}
                  active={isActive}
                  filled={!isActive}
                />
              }
            />
          );
        })}
      </div>
    </ScreenFrame>
  );
}
