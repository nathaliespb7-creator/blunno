# Blunno — PWA & offline expectations

## Current state (post design-system pass)

- **Web app manifest** is generated via [app/manifest.ts](app/manifest.ts) (`display: standalone`, icons, theme colors aligned with `--color-core-bg`).
- **`next-pwa`** is listed in `package.json` but **not wired** in `next.config.ts`. There is **no** active service worker in production builds unless you add the plugin (or a custom SW).
- **Dev**: [src/components/shared/DevCacheReset.tsx](src/components/shared/DevCacheReset.tsx) unregisters service workers and clears caches on **development** only to avoid stale bundles.

## Offline / data

- **Planner** task state is **in-memory** (React state). It does **not** persist across reloads or work fully offline-first until data is written to `localStorage`, IndexedDB (e.g. Dexie), or a sync layer.
- **Tetris** persists a top score via `localStorage` (`blunno.tetris.topScore`).

## Responsive checks (manual)

Verify at **320**, **375**, **768**, **1280** px width on:

- `/` (welcome)
- `/choose`
- `/sos`
- `/planner`
- `/play`

Look for: no horizontal scroll, tap targets ≥ 44×44px, safe-area padding respected, no overlapping headers and CTAs.

## Recommended next steps for true PWA/offline-first

1. Enable **next-pwa** (or **@ducanh2912/next-pwa**) in `next.config.ts` with a sensible cache strategy for static assets and `start_url`.
2. Persist planner tasks (and any critical SOS progress if needed) to **IndexedDB** or `localStorage` with migration/versioning.
3. Add an **offline shell** route or fallback UI when `navigator.onLine === false`.
