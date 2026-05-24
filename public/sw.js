/* eslint-disable no-restricted-globals */

const STATIC_CACHE = 'blunno-static-v12';
const RUNTIME_CACHE = 'blunno-runtime-v12';
const OFFLINE_URL = '/offline';

const APP_ROUTES = new Set(['/', '/choose', '/planner', '/play', '/relax', '/sos', '/offline']);

function extractAssetUrls(html) {
  const matches = html.match(/\/_next\/static\/[^"'\s)]+/g) ?? [];
  return [...new Set(matches.map((url) => url.replace(/\\+$/, '')))];
}

function extractPublicAssetUrls(html) {
  const matches =
    html.match(/\/(?!\/)[^"'\s)]+\.(?:png|jpe?g|webp|svg|mp3|wav|ogg|woff2?)/gi) ?? [];
  return [...new Set(matches.map((url) => url.replace(/\\+$/, '')))];
}

function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/audio/') ||
    pathname === '/manifest.webmanifest' ||
    /\.(?:js|css|png|jpg|jpeg|webp|svg|ico|woff2?|webmanifest|mp3|wav|ogg)$/i.test(pathname)
  );
}

async function cacheUrl(cache, url) {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`Failed ${url}: ${response.status}`);
  }
  await cache.put(url, response.clone());
  return response;
}

async function precacheRouteWithAssets(cache, url) {
  const response = await cacheUrl(cache, url);
  const html = await response.text();
  const assets = [...new Set([...extractAssetUrls(html), ...extractPublicAssetUrls(html)])];

  for (const assetUrl of assets) {
    try {
      await cache.add(assetUrl);
    } catch {
      /* best-effort per asset */
    }
  }
}

async function matchCachedDocument(cache, request, pathname) {
  return (
    (await cache.match(request)) ??
    (await cache.match(pathname)) ??
    (await cache.match(`${pathname}/`)) ??
    (await cache.match(new URL(pathname, self.location.origin).toString()))
  );
}

async function handleAppRoute(request, pathname) {
  const staticCache = await caches.open(STATIC_CACHE);
  const cached =
    (await matchCachedDocument(staticCache, request, pathname)) ??
    (await matchCachedDocument(await caches.open(RUNTIME_CACHE), request, pathname));

  try {
    const response = await fetch(request);
    const copy = response.clone();
    caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
    return response;
  } catch {
    if (cached) return cached;

    const offlineFallback = await staticCache.match(OFFLINE_URL);
    return offlineFallback ?? Response.error();
  }
}

async function handleStaticAsset(request, pathname) {
  const staticCache = await caches.open(STATIC_CACHE);
  const cached =
    (await caches.match(request)) ??
    (await staticCache.match(pathname)) ??
    (await staticCache.match(new URL(pathname, self.location.origin).href));

  try {
    const response = await fetch(request);
    const copy = response.clone();
    caches.open(RUNTIME_CACHE).then((runtimeCache) => runtimeCache.put(request, copy));
    return response;
  } catch {
    return cached ?? Response.error();
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      let manifest = null;
      try {
        manifest = await fetch('/precache-manifest.json', { credentials: 'same-origin' }).then((response) =>
          response.json()
        );
      } catch {
        /* fall back to defaults below */
      }

      const iconUrls = manifest?.icons ?? [
        '/manifest.webmanifest',
        '/precache-manifest.json',
        '/icon-192.png',
        '/icon-512.png',
        '/apple-touch-icon-v6.png',
      ];

      for (const url of iconUrls) {
        try {
          await cache.add(url);
        } catch {
          /* best-effort */
        }
      }

      const routeUrls = manifest?.routes ?? ['/', '/choose', '/planner', '/play', '/relax', '/sos', OFFLINE_URL];
      for (const url of routeUrls) {
        try {
          await precacheRouteWithAssets(cache, url);
        } catch {
          /* best-effort per route */
        }
      }

      for (const mediaUrl of manifest?.media ?? []) {
        try {
          await cache.add(mediaUrl);
        } catch {
          /* best-effort */
        }
      }

      for (const assetUrl of manifest?.assets ?? []) {
        try {
          await cache.add(assetUrl);
        } catch {
          /* best-effort */
        }
      }

      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (APP_ROUTES.has(url.pathname)) {
    event.respondWith(handleAppRoute(request, url.pathname));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request, url.pathname));
  }
});
