import { expect, test } from '@playwright/test';

import {
  SOS_BREATHS_PER_RING,
  SOS_MINI_CYCLE_MS,
  SOS_SCALE_MAX,
  SOS_SCALE_MIN,
  mascotSizePx,
  scaleFromTimedCycleProgress,
} from '../src/lib/sosBreathing';
import { clickMood, clickStartNow, gotoAndSettle } from './helpers';

const MINI_INHALE_FRACTION = 3 / 8;
const FULL_RING_MS = SOS_MINI_CYCLE_MS * SOS_BREATHS_PER_RING;

test.describe('SOS breathing scale helpers', () => {
  test('scaleFromTimedCycleProgress maps 3-2-3 with two breaths per ring', () => {
    expect(scaleFromTimedCycleProgress(0)).toBeCloseTo(SOS_SCALE_MIN, 5);
    expect(scaleFromTimedCycleProgress(MINI_INHALE_FRACTION / SOS_BREATHS_PER_RING)).toBeCloseTo(
      SOS_SCALE_MAX,
      5
    );
    expect(scaleFromTimedCycleProgress(0.25)).toBeCloseTo(SOS_SCALE_MAX, 5);
    expect(scaleFromTimedCycleProgress(0.5)).toBeCloseTo(SOS_SCALE_MIN, 5);
    expect(scaleFromTimedCycleProgress(1)).toBeCloseTo(SOS_SCALE_MIN, 5);
    expect(SOS_BREATHS_PER_RING).toBe(2);
    expect(FULL_RING_MS).toBe(16_000);
  });

  test('mascotSizePx fits inside ring inner diameter', () => {
    const size = mascotSizePx(280, 26, 120);
    expect(size).toBeLessThanOrEqual(120);
    expect(size).toBeGreaterThan(0);
  });
});

test.describe('SOS breathing exercise', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'SOS');
    await expect(page).toHaveURL('/sos');
  });

  test('loads exercise UI and exits to choose', async ({ page }) => {
    await expect(page.getByLabel('SOS breathing exercise')).toBeVisible();
    await expect(page.getByLabel('Tap to start breathing exercise')).toBeVisible();
    await expect(page.getByText(/Cycle 1 of 3/)).toBeVisible();
    await page.getByRole('link', { name: 'Exit to mode selection' }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('starts guided breathing on ring tap', async ({ page }) => {
    await page.getByLabel('Tap to start breathing exercise').click();
    await expect(page.getByTestId('sos-phase-label')).toHaveText('Inhale');
    await expect(page.getByTestId('sos-countdown')).toBeVisible();
    await expect(page.getByText('Breath 1 of 2')).toBeVisible();
    const countdown = Number(await page.getByTestId('sos-countdown').textContent());
    expect(countdown).toBeLessThanOrEqual(3);
    expect(countdown).toBeGreaterThan(0);
    await expect(page.getByTestId('sos-mascot')).toBeVisible();
  });

  test('trace mode fills ring when dragging clockwise', async ({ page }) => {
    await page.getByTestId('sos-mode-trace').click();
    const ring = page.getByLabel('Trace the ring with your finger to begin');

    await ring.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = rect.width * 0.42;
      const dispatch = (type: string, x: number, y: number) => {
        el.dispatchEvent(
          new PointerEvent(type, {
            clientX: x,
            clientY: y,
            bubbles: true,
            pointerId: 1,
            pointerType: 'touch',
            isPrimary: true,
          })
        );
      };
      dispatch('pointerdown', cx, cy - r);
      for (let step = 1; step <= 12; step += 1) {
        const angle = -Math.PI / 2 + (step / 12) * Math.PI;
        dispatch('pointermove', cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      }
      dispatch('pointerup', cx, cy);
    });

    await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible();
    await expect(page.getByText('Breath 1 of 2')).toBeVisible();
  });

  test('mascot scale updates while guided session runs', async ({ page }) => {
    await page.getByLabel('Tap to start breathing exercise').click();
    const mascot = page.getByTestId('sos-mascot');

    const readScale = () =>
      mascot.evaluate((el) => {
        const target = el.parentElement;
        if (!target) return 1;
        const transform = window.getComputedStyle(target).transform;
        if (transform === 'none') return 1;
        return new DOMMatrix(transform).a;
      });

    await page.waitForTimeout(500);
    const scaleEarly = await readScale();
    await page.waitForTimeout(2800);
    const scaleAfterInhale = await readScale();

    expect(scaleEarly).toBeGreaterThanOrEqual(SOS_SCALE_MIN - 0.05);
    expect(scaleAfterInhale).toBeGreaterThan(scaleEarly);
  });
});

test.describe('SOS layout — iPhone SE', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  const MIN_HEADER_TOGGLE_GAP = 4;

  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'SOS');
    await expect(page).toHaveURL('/sos');
  });

  test('header and mode toggle do not overlap on idle screen', async ({ page }) => {
    const header = page.getByTestId('sos-header');
    const toggle = page.getByTestId('sos-mode-toggle');

    await expect(header).toBeVisible();
    await expect(toggle).toBeVisible();

    const headerBox = await header.boundingBox();
    const toggleBox = await toggle.boundingBox();
    expect(headerBox).not.toBeNull();
    expect(toggleBox).not.toBeNull();
    if (!headerBox || !toggleBox) return;

    const gap = toggleBox.y - (headerBox.y + headerBox.height);
    expect(gap).toBeGreaterThanOrEqual(MIN_HEADER_TOGGLE_GAP);
  });

  test('mode toggle is hidden while session runs', async ({ page }) => {
    await page.getByLabel('Tap to start breathing exercise').click();
    await expect(page.getByTestId('sos-mode-toggle')).not.toBeVisible();
  });
});
