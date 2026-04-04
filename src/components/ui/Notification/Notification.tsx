'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useBlunnoStore } from '@/store/blunnoStore';

function NotificationItem({
  id,
  type,
  message,
  duration,
}: {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}) {
  const removeNotification = useBlunnoStore((s) => s.removeNotification);
  const animationPreference = useBlunnoStore((s) => s.ui.animationPreference);

  useEffect(() => {
    if (duration === undefined || duration <= 0) return;
    const t = window.setTimeout(() => removeNotification(id), duration);
    return () => window.clearTimeout(t);
  }, [id, duration, removeNotification]);

  const styles: Record<typeof type, string> = {
    success:
      'border-blunno-lime/60 bg-black/50 text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-md',
    error:
      'border-blunno-coral/70 bg-black/55 text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-md',
    warning:
      'border-blunno-gold/70 bg-black/50 text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-md',
    info: 'border-blunno-blue/70 bg-black/50 text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-md',
  };

  const labels: Record<typeof type, string> = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  };

  return (
    <motion.div
      layout
      role="status"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: animationPreference === 'none' ? 0 : 0.22 }}
      className={cn(
        'pointer-events-auto max-w-sm rounded-card border px-4 py-3 font-sans text-sm shadow-screen',
        styles[type]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-figma text-white/70">
            {labels[type]}
          </p>
          <p className="mt-0.5 leading-snug">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => removeNotification(id)}
          className="shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-white/60 transition hover:bg-white/10 hover:text-white"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Renders queued toasts from `useBlunnoStore` (`addNotification` / `removeNotification`).
 * Mount once near the app root (e.g. in a layout or page shell).
 */
export function Notification() {
  const notifications = useBlunnoStore((s) => s.ui.notifications);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end sm:pr-6"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <NotificationItem key={n.id} {...n} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
