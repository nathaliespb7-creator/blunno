'use client';

import { useEffect } from 'react';

const ANDROID_NAV_COLOR = '#120f25';

function upsertMeta(name: string, content: string): void {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.name = name;
    document.head.appendChild(node);
  }
  node.content = content;
}

export function AndroidNavBarColor() {
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes('android');
    if (!isAndroid) return;

    upsertMeta('theme-color', ANDROID_NAV_COLOR);
    upsertMeta('msapplication-navbutton-color', ANDROID_NAV_COLOR);
    upsertMeta('mobile-web-app-capable', 'yes');
    upsertMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    upsertMeta('color-scheme', 'dark');

    document.documentElement.style.backgroundColor = ANDROID_NAV_COLOR;
    document.body.style.backgroundColor = ANDROID_NAV_COLOR;
  }, []);

  return null;
}
