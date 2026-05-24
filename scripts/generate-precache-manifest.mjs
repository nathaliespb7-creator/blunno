import { readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { OFFLINE_SW_VERSION } from './offline-version.mjs';

const ROUTES = ['/', '/choose', '/planner', '/play', '/relax', '/sos', '/offline'];
const ICONS = [
  '/manifest.webmanifest',
  '/precache-manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon-v6.png',
];

async function walkStaticFiles(dir, rel = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const relPath = rel ? `${rel}/${entry.name}` : entry.name;
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkStaticFiles(fullPath, relPath)));
      continue;
    }

    files.push(`/_next/static/${relPath}`);
  }

  return files;
}

async function walkPublicMedia(dir, urlPrefix = '') {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = [];

  for (const entry of entries) {
    const urlPath = `${urlPrefix}/${entry.name}`.replace(/\/{2,}/g, '/');
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkPublicMedia(fullPath, urlPath)));
      continue;
    }

    if (/\.(?:png|jpe?g|webp|svg|mp3|wav|ogg)$/i.test(entry.name)) {
      files.push(urlPath.startsWith('/') ? urlPath : `/${urlPath}`);
    }
  }

  return files;
}

const assets = await walkStaticFiles('.next/static');
const media = [...new Set(await walkPublicMedia('public'))];
const manifest = {
  version: OFFLINE_SW_VERSION,
  generatedAt: new Date().toISOString(),
  routes: ROUTES,
  icons: ICONS,
  media,
  assets,
};

await writeFile('public/precache-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `precache manifest: ${assets.length} build assets, ${media.length} public media, ${ROUTES.length} routes`
);
