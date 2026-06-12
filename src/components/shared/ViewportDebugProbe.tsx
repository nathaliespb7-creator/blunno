'use client';

import { useEffect, useState } from 'react';

const DEBUG_ENDPOINT = 'http://127.0.0.1:7569/ingest/48470933-d439-4b67-9629-7611686a2ab6';
const SESSION_ID = '5077d9';

type ProbeSnapshot = {
  ua: string;
  innerHeight: number;
  innerWidth: number;
  vvHeight: number | null;
  vvOffsetTop: number | null;
  displayMode: string;
  htmlClasses: string;
  welcomeScreen: { height: number; paddingTop: string; paddingBottom: string; overflow: string } | null;
  welcomeFrame: { height: number; bottom: number } | null;
  startCta: { top: number; bottom: number; left: number; right: number; pointerEvents: string } | null;
  mascot: { width: number; height: number; computedWidth: string; visible: boolean } | null;
  masks: Array<{ className: string; height: number; pointerEvents: string; zIndex: string }>;
  hitTestCta: string | null;
  hitTestTop: string | null;
  hitTestBottom: string | null;
};

function readSnapshot(): ProbeSnapshot {
  const welcomeScreen = document.querySelector<HTMLElement>('.welcome-screen');
  const welcomeFrame = document.querySelector<HTMLElement>('.welcome-frame');
  const startCta = document.querySelector<HTMLElement>('.welcome-cta');
  const welcomeMascot = document.querySelector<HTMLElement>('.welcome-mascot-root');
  const vv = window.visualViewport;

  const rect = startCta?.getBoundingClientRect();
  const mascotRect = welcomeMascot?.getBoundingClientRect();
  const hitTestCta =
    rect && rect.width > 0
      ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)?.className ??
        'null'
      : null;

  return {
    ua: navigator.userAgent,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    vvHeight: vv?.height ?? null,
    vvOffsetTop: vv?.offsetTop ?? null,
    displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
    htmlClasses: document.documentElement.className,
    welcomeScreen: welcomeScreen
      ? {
          height: welcomeScreen.clientHeight,
          paddingTop: getComputedStyle(welcomeScreen).paddingTop,
          paddingBottom: getComputedStyle(welcomeScreen).paddingBottom,
          overflow: getComputedStyle(welcomeScreen).overflow,
        }
      : null,
    welcomeFrame: welcomeFrame
      ? {
          height: welcomeFrame.clientHeight,
          bottom: welcomeFrame.getBoundingClientRect().bottom,
        }
      : null,
    startCta: rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          pointerEvents: startCta ? getComputedStyle(startCta).pointerEvents : 'n/a',
        }
      : null,
    mascot: welcomeMascot
      ? {
          width: mascotRect?.width ?? 0,
          height: mascotRect?.height ?? 0,
          computedWidth: getComputedStyle(welcomeMascot).width,
          visible: (mascotRect?.width ?? 0) > 40,
        }
      : null,
    masks: Array.from(document.querySelectorAll<HTMLElement>('.android-edge-mask, body')).map((el) => ({
      className: el.className || el.tagName.toLowerCase(),
      height: el.getBoundingClientRect().height,
      pointerEvents: getComputedStyle(el).pointerEvents,
      zIndex: getComputedStyle(el).zIndex,
    })),
    hitTestCta,
    hitTestTop: document.elementFromPoint(window.innerWidth / 2, 8)?.className ?? 'null',
    hitTestBottom: document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 8)?.className ?? 'null',
  };
}

function emit(hypothesisId: string, message: string, data: ProbeSnapshot, runId: string) {
  // #region agent log
  fetch(DEBUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': SESSION_ID },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      runId,
      hypothesisId,
      location: 'ViewportDebugProbe.tsx',
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

export function ViewportDebugProbe() {
  const [overlay, setOverlay] = useState<string>('');

  useEffect(() => {
    const enabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'development';

    if (!enabled) return;

    const runProbe = (reason: string) => {
      const snapshot = readSnapshot();
      emit('A', `viewport probe: ${reason}`, snapshot, 'post-fix2');
      emit('F', `mascot probe: ${reason}`, snapshot, 'post-fix2');
      emit('G', `cta position probe: ${reason}`, snapshot, 'post-fix2');
      setOverlay(JSON.stringify(snapshot, null, 2));
    };

    runProbe('mount');
    window.visualViewport?.addEventListener('resize', () => runProbe('vv-resize'));
    window.addEventListener('orientationchange', () => runProbe('orientation'));
    window.addEventListener('resize', () => runProbe('resize'));

    return () => {
      window.visualViewport?.removeEventListener('resize', () => runProbe('vv-resize'));
      window.removeEventListener('orientationchange', () => runProbe('orientation'));
      window.removeEventListener('resize', () => runProbe('resize'));
    };
  }, []);

  if (!overlay) return null;

  return (
    <pre
      style={{
        position: 'fixed',
        left: 8,
        bottom: 8,
        zIndex: 2147483647,
        maxHeight: '40vh',
        overflow: 'auto',
        padding: 8,
        margin: 0,
        fontSize: 10,
        lineHeight: 1.25,
        color: '#0f0',
        background: 'rgba(0,0,0,0.82)',
        border: '1px solid #0f0',
        pointerEvents: 'none',
        whiteSpace: 'pre-wrap',
      }}
    >
      {overlay}
    </pre>
  );
}
