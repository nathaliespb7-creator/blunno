/* eslint-disable no-restricted-globals */
/* Generated from sw.template.js by scripts/generate-sw.mjs — do not edit public/sw.js directly. */

const STATIC_CACHE = 'blunno-static-v__OFFLINE_SW_VERSION__';
const RUNTIME_CACHE = 'blunno-runtime-v__OFFLINE_SW_VERSION__';
const OFFLINE_SW_VERSION = __OFFLINE_SW_VERSION__;
const OFFLINE_URL = '/offline';
const MAX_RUNTIME_ENTRIES = 64;

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

function isMediaAsset(pathname) {
  return (
    pathname.startsWith('/audio/') ||
    /\/blunno-mascot.*\.(?:png|jpe?g|webp)$/i.test(pathname) ||
    pathname === '/blunno.png' ||
    /\.(?:mp3|wav|ogg)$/i.test(pathname)
  );
}

function isStaticAsset(pathname) {
  if (isMediaAsset(pathname)) return false;

  return (
    pathname.startsWith('/_next/static/') ||
    pathname === '/manifest.webmanifest' ||
    /\.(?:js|css|png|jpg|jpeg|webp|svg|ico|woff2?|webmanifest)$/i.test(pathname)
  );
}

function isRedirect(response) {
  return response.status >= 300 && response.status < 400;
}

function getContentType(response) {
  return (response.headers.get('content-type') ?? '').toLowerCase();
}

function isCacheableDocumentResponse(response) {
  if (!response.ok || isRedirect(response)) return false;
  return getContentType(response).includes('text/html');
}

function isCacheableAssetResponse(response, pathname) {
  if (!response.ok || isRedirect(response)) return false;

  const type = getContentType(response);

  if (pathname.startsWith('/_next/static/')) {
    return type.includes('javascript') || type.includes('css') || type.includes('octet-stream');
  }
  if (/\.(?:mp3|wav|ogg)$/i.test(pathname)) {
    return type.includes('audio') || type.includes('octet-stream');
  }
  if (/\.(?:png|jpg|jpeg|webp|svg|ico)$/i.test(pathname)) {
    return type.includes('image') || type.includes('octet-stream');
  }
  if (/\.(?:woff2?)$/i.test(pathname)) {
    return type.includes('font') || type.includes('octet-stream');
  }
  if (pathname === '/manifest.webmanifest' || /\.webmanifest$/i.test(pathname)) {
    return type.includes('json') || type.includes('manifest');
  }
  if (/\.css$/i.test(pathname)) return type.includes('css');
  if (/\.js$/i.test(pathname)) return type.includes('javascript');

  return false;
}

async function trimRuntimeCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_RUNTIME_ENTRIES) return;

  const excess = keys.length - MAX_RUNTIME_ENTRIES;
  for (let i = 0; i < excess; i += 1) {
    await cache.delete(keys[i]);
  }
}

async function putRuntimeCache(request, response) {
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.put(request, response.clone());
  await trimRuntimeCache(cache);
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
    if (isCacheableDocumentResponse(response)) {
      await putRuntimeCache(request, response);
    }
    return response;
  } catch {
    if (cached) return cached;

    const offlineFallback = await staticCache.match(OFFLINE_URL);
    return offlineFallback ?? Response.error();
  }
}

async function handleMediaAsset(request, pathname) {
  const staticCache = await caches.open(STATIC_CACHE);
  const originUrl = new URL(pathname, self.location.origin).href;
  const cached =
    (await caches.match(request)) ??
    (await staticCache.match(pathname)) ??
    (await staticCache.match(originUrl));

  const revalidate = async () => {
    try {
      const response = await fetch(request);
      if (isCacheableAssetResponse(response, pathname)) {
        await staticCache.put(request, response.clone());
      }
    } catch {
      /* offline or flaky network — cached copy remains valid */
    }
  };

  if (cached) {
    void revalidate();
    return cached;
  }

  try {
    const response = await fetch(request);
    if (isCacheableAssetResponse(response, pathname)) {
      await staticCache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
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
    if (isCacheableAssetResponse(response, pathname)) {
      await putRuntimeCache(request, response);
    }
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
        manifest = await fetch(`/precache-manifest.json?v=${OFFLINE_SW_VERSION}`, {
          credentials: 'same-origin',
          cache: 'no-store',
        }).then((response) => response.json());
      } catch {
        /* fall back to defaults below */
      }

      const iconUrls = manifest?.icons ?? [
        '/manifest.webmanifest',
        '/precache-manifest.json',
        '/icon-192.png',
        '/icon-512.png',
        '/apple-touch-icon-v10.png',
        '/icon-512-maskable.png',
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

  if (isMediaAsset(url.pathname)) {
    event.respondWith(handleMediaAsset(request, url.pathname));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request, url.pathname));
  }
});
