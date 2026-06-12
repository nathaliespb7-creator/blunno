# Blunno — PWA & offline

## Current state

- **Manifest:** [app/manifest.ts](../app/manifest.ts) — `standalone`, portrait, icons, screenshots, `start_url: /app`.
- **Service worker:** custom pipeline in [public/sw.template.js](../public/sw.template.js), generated to [public/sw.js](../public/sw.js) on build.
- **Versioning:** bump [scripts/offline-version.mjs](../scripts/offline-version.mjs) to invalidate caches.
- **Registration:** [src/components/shared/ServiceWorkerRegister.tsx](../src/components/shared/ServiceWorkerRegister.tsx) — prod-only, `updateViaCache: 'none'`, one reload on controller change.
- **Precache:** [scripts/generate-precache-manifest.mjs](../scripts/generate-precache-manifest.mjs) — routes, icons, relax audio, `_next/static` chunks.
- **Offline fallback:** [app/offline/page.tsx](../app/offline/page.tsx).

## Build

```bash
npm run build
```

This runs `next build`, then generates `public/sw.js` and `public/precache-manifest.json`.

## Offline routes precached

`/`, `/app`, `/choose`, `/planner`, `/play`, `/relax`, `/sos`, `/offline`, `/privacy`

## Manual checks

Verify at **360**, **375**, **393**, **768** px width:

- `/app`, `/choose`, `/sos`, `/planner`, `/play`, `/relax`
- No horizontal scroll on mood/game lists
- Safe-area padding respected
- Offline open after first online visit (airplane mode)

## E2E release gate

```bash
npm run test:e2e
```

Uses production build + `next start`. Default locale is Russian (`E2E_LOCALE=ru`). For English smoke:

```bash
E2E_LOCALE=en npm run test:e2e
```

## PWA Builder packaging

See [PWA-BUILDER-RUSTORE.md](./PWA-BUILDER-RUSTORE.md) for Android packaging and RuStore checklist.
