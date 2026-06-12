# PWA Builder → RuStore release checklist

Use this after `npm run build` and a green `npm run test:e2e`.

## 1. Web release gate (automated)

```bash
npm run build
npm run test:e2e
```

Covers: navigation, games, SOS, planner, relax, offline routes, PWA assets, choose layout regressions.

## 2. PWA Builder packaging

1. Open [PWABuilder](https://www.pwabuilder.com/) and enter `https://blunno.app`.
2. Confirm installability: manifest, SW, icons 192/512 + maskable, screenshots.
3. Generate Android package (TWA/APK/AAB).
4. Configure:
   - **Package ID** (example: `app.blunno.pwa`)
   - **App name:** Blunno
   - **Start URL:** `/app`
   - **Theme color:** `#120f25`
   - **Signing key** — store securely for RuStore updates

## 3. Digital Asset Links

Host at `https://blunno.app/.well-known/assetlinks.json` after PWA Builder gives you the SHA-256 fingerprint:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "YOUR.PACKAGE.NAME",
      "sha256_cert_fingerprints": ["YOUR:SHA256:FINGERPRINT"]
    }
  }
]
```

Without this file, TWA may open links in Chrome instead of the installed app.

## 4. Manual Android smoke (real device)

Install the generated package and verify:

### Cold / warm start
- [ ] App opens to welcome (`/app`) without white screen
- [ ] Second launch is fast (warm start)
- [ ] Resume after background keeps state

### Navigation
- [ ] Welcome → Choose → each mode (SOS, Planner, Play, Relax)
- [ ] Home / back buttons work on every screen
- [ ] **System Back** from nested Play game returns to game hub, not exit app
- [ ] Repeat Choose ↔ Play ↔ Choose 5× — all 4 mood tiles visible every time

### Layout
- [ ] Choose: 4 tiles visible (SOS, Planner, Play, Relax)
- [ ] Play: all 5 games visible or scrollable
- [ ] Sudoku: full 9×9 board visible, keypad below board
- [ ] SOS: ring stable, no header overlap on small screen

### Offline
- [ ] First launch online (precache completes)
- [ ] Airplane mode: open Choose, SOS, Planner, Play hub, Relax
- [ ] Offline relax tracks play after precache

### Audio
- [ ] UI sounds on navigation (after first tap)
- [ ] SOS inhale/exhale during session
- [ ] Relax tracks play and pause

### PWA update
- [ ] Deploy new version → reopen app → gets new SW (may reload once)
- [ ] No stuck old UI after update

## 5. RuStore store listing

Prepare separately from the web manifest:

- [ ] Russian app description (short + full)
- [ ] Category: Health / Education / Lifestyle
- [ ] Screenshots (phone, 1080×1920 or store requirements)
- [ ] Privacy policy URL: `https://blunno.app/privacy`
- [ ] Age rating questionnaire
- [ ] App icon 512×512
- [ ] Contact email for support

## 6. Release blockers

Do **not** publish if any of these fail:

- PWA Builder installability errors
- E2E red on `main`
- Missing `/sounds/*.mp3` or `/audio/pop.mp3` on production
- Mood tiles clip/disappear after navigation
- Sudoku board overlapped by keypad
- Offline core routes fail after precache
- System Back exits app from mid-flow incorrectly

## 7. Post-release monitoring

- Watch RuStore crash reports / ANR
- Test update path within 24h of next deploy
- Bump `OFFLINE_SW_VERSION` on every cache-breaking release
