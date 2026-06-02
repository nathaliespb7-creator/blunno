'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Volume2, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { relaxAudioService, type RelaxSoundId } from '@/services/relaxAudioService';
import { RELAX_SOUNDS } from '@/config/relaxSounds';

export function GlobalAudioIndicator() {
  const pathname = usePathname();
  const [activeSoundId, setActiveSoundId] = useState<RelaxSoundId | null>(null);

  useEffect(() => {
    return relaxAudioService.onStateChange(setActiveSoundId);
  }, []);

  // Hide indicator on the relax page itself, on the landing page, and on the welcome screen
  if (!activeSoundId || pathname === '/relax' || pathname === '/' || pathname === '/app') return null;

  const activeSound = RELAX_SOUNDS.find((s) => s.id === activeSoundId);
  if (!activeSound) return null;

  const handleStop = () => {
    relaxAudioService.stop();
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={handleStop}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border bg-black/60 px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all hover:scale-105 hover:bg-black/80 active:scale-95"
        style={{
          boxShadow: `0 0 20px -4px ${activeSound.color}40, inset 0 0 12px ${activeSound.color}15`,
          borderColor: `${activeSound.color}30`,
        }}
        aria-label={`Stop ${activeSound.name}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: activeSound.color }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: activeSound.color }}
          />
        </span>
        <Volume2 className="h-3.5 w-3.5" style={{ color: activeSound.color }} />
        <span className="max-w-[120px] truncate">{activeSound.name}</span>
        <Square className="ml-1 h-2.5 w-2.5 fill-white/60 text-transparent" />
      </motion.button>
    </AnimatePresence>
  );
}
