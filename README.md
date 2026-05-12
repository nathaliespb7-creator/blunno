# Blunno

Blunno is a calming, mobile-first Next.js app focused on reducing stress through short, lightweight activities:
- quick breathing flow (`SOS`)
- simple daily planning (`Planner`)
- playful micro-games (`Play`)
- a dedicated relax section (`Relax`)

Production: [https://blunno.app](https://blunno.app)

## Main user flow

1. `Welcome` (`/`) - intro screen with mascot interaction.
2. `Choose` (`/choose`) - pick current mood/activity mode.
3. Mode screens:
   - `/sos` - 3-cycle breathing exercise with progress ring.
   - `/planner` - daily task list and week navigation.
   - `/play` - game hub (Sudoku, Tetris, Balloon Pop).
   - `/relax` - lightweight relax placeholder screen.

## Features

- **5-color design system** via global CSS tokens and gradients.
- **Accessibility-minded UI**:
  - responsive layouts and safe-area padding
  - `prefers-reduced-motion` support
  - visible focus states and touch-friendly controls
- **Audio feedback** powered by Howler.
- **Game/state highlights**:
  - Sudoku board with keypad and conflict highlighting
  - Tetris with top-score persistence in `localStorage`
  - Planner with daily/weekly UX (currently in-memory tasks)

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Zustand
- Howler

## Project structure

- `app/` - routes/pages (`/`, `/choose`, `/sos`, `/planner`, `/play`, `/relax`)
- `src/components/features/` - feature UI (SOS, Play, Sudoku, Tetris, etc.)
- `src/components/ui/` - reusable primitives
- `app/globals.css` - design tokens, theme gradients, shared styles
- `docs/` - implementation notes (including PWA/offline expectations)

## Getting started

### Requirements

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build production bundle

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## Deployment

Blunno is deployed on Vercel.

Typical production deploy command:

```bash
vercel deploy /absolute/path/to/blunno --prod --yes
```

## PWA / offline notes

See [`docs/PWA-OFFLINE.md`](docs/PWA-OFFLINE.md).

Current status:
- Manifest is configured.
- `next-pwa` dependency exists but service worker integration is not fully wired in `next.config.ts`.
- Planner data is not yet persisted across reloads (in-memory for now).
