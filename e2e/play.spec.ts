import { clickMood, clickStartNow, expect, gameCard, gotoAndSettle, test } from './helpers';

const GAMES = ['Sudoku', 'Tetris', 'Pop It', 'Memory Match', 'Slide Puzzle'] as const;

async function startPopItRound(page: import('@playwright/test').Page): Promise<void> {
  const card = gameCard(page, 'Pop It');
  await expect(card).toBeVisible();

  await expect(async () => {
    await card.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByRole('heading', { name: 'Pop It', level: 1 })).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByTestId('popit-game')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('popit-blow').click();
  await expect(page.getByTestId('popit-canvas')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('popit-field')).toHaveAttribute('data-playing', 'true');
  await expect(page.getByTestId('popit-live-count')).not.toHaveText('Live: 0', { timeout: 10000 });
}

async function popCanvasBubble(page: import('@playwright/test').Page): Promise<void> {
  await page.evaluate(() => {
    const canvas = document.querySelector('[data-testid="popit-canvas"]') as HTMLCanvasElement | null;
    if (!canvas) throw new Error('Pop It canvas not found');
    const rect = canvas.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;
    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX,
        clientY,
        pointerId: 1,
        pointerType: 'mouse',
      }),
    );
  });
}

test.describe('Play hub and games', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'PLAY');
    await expect(page).toHaveURL('/play');
  });

  test('fits all game cards on one screen without scroll on iPhone SE', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoAndSettle(page, '/play');

    const pageOverflow = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 1);
    expect(pageOverflow).toBe(false);

    for (const title of GAMES) {
      const card = gameCard(page, title);
      await expect(card).toBeVisible();
      const playBtn = card.getByRole('button', { name: 'Play' });
      await expect(playBtn).toBeVisible();
      await expect(playBtn).toBeInViewport();
    }
  });

  test('fits all game cards on one screen without scroll on iPhone 14 Pro', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await gotoAndSettle(page, '/play');

    const pageOverflow = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight + 1);
    expect(pageOverflow).toBe(false);

    for (const title of GAMES) {
      const card = gameCard(page, title);
      await expect(card).toBeVisible();
      await expect(card.getByRole('button', { name: 'Play' })).toBeInViewport();
    }
  });

  for (const title of GAMES) {
    test(`opens ${title}, returns to hub, exits to choose`, async ({ page }) => {
      const card = gameCard(page, title);
      await expect(card).toBeVisible();

      await expect(async () => {
        await card.getByRole('button', { name: 'Play' }).click();
        await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });

      await expect(page.getByRole('button', { name: 'Back to games' })).toBeVisible();

      await page.getByRole('button', { name: 'Back to games' }).click();
      await expect(page.getByRole('heading', { name: 'Mini Games' })).toBeVisible();

      await expect(async () => {
        await card.getByRole('button', { name: 'Play' }).click();
        await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });

      await page.getByRole('link', { name: 'Exit to mode selection' }).click();
      await expect(page).toHaveURL('/choose');
    });
  }

  test('Pop It canvas pops bubbles and updates score', async ({ page }) => {
    await startPopItRound(page);
    await expect(page.getByTestId('popit-score')).toHaveText('Popped: 0');

    await popCanvasBubble(page);
    await expect(page.getByTestId('popit-score')).toHaveText('Popped: 1');
  });

  test('Memory Match flips cards and updates score on match', async ({ page }) => {
    const card = gameCard(page, 'Memory Match');
    await expect(async () => {
      await card.getByRole('button', { name: 'Play' }).click();
      await expect(page.getByTestId('memory-game')).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });
    await expect(page.getByTestId('memory-score')).toHaveText('Pairs: 0 / 6');

    await page.getByRole('button', { name: 'Face-down card' }).first().click();
    await expect(page.getByTestId('memory-score')).toHaveText('Pairs: 0 / 6');
    await expect(page.getByRole('button', { name: / card$/ }).first()).toBeVisible();
  });

  test('Memory Match matching pair updates score', async ({ page }) => {
    const card = gameCard(page, 'Memory Match');
    await card.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('memory-game')).toBeVisible();

    await page.getByRole('button', { name: 'Face-down card' }).first().click();

    const faceDown = page.getByRole('button', { name: 'Face-down card' });
    const count = await faceDown.count();
    for (let index = 0; index < count; index += 1) {
      await faceDown.nth(index).click();
      const score = await page.getByTestId('memory-score').innerText();
      if (score === 'Pairs: 1 / 6') break;
      await page.waitForTimeout(650);
    }

    await expect(page.getByTestId('memory-score')).toHaveText('Pairs: 1 / 6');
  });

  test('Pop It restart resets score', async ({ page }) => {
    await startPopItRound(page);
    await popCanvasBubble(page);
    await expect(page.getByTestId('popit-score')).toHaveText('Popped: 1');

    await page.getByRole('button', { name: 'Restart' }).click();
    await expect(page.getByTestId('popit-score')).toHaveText('Popped: 0');
    await expect(page.getByTestId('popit-blow')).toBeVisible();
  });

  test('Slide Puzzle invalid move does not increment counter', async ({ page }) => {
    const card = gameCard(page, 'Slide Puzzle');
    await card.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('slide-moves')).toHaveText('Moves: 0');

    const tiles = page.getByRole('button', { name: /^Tile \d+$/ });
    const tileCount = await tiles.count();
    let invalidMoveFound = false;

    for (let index = 0; index < tileCount; index += 1) {
      const before = await page.getByTestId('slide-moves').innerText();
      await tiles.nth(index).click();
      const after = await page.getByTestId('slide-moves').innerText();
      if (before === after) {
        invalidMoveFound = true;
        break;
      }
    }

    expect(invalidMoveFound).toBe(true);
    await expect(page.getByTestId('slide-moves')).toHaveText('Moves: 0');
  });

  test('Slide Puzzle increments move counter', async ({ page }) => {
    const card = gameCard(page, 'Slide Puzzle');
    await card.getByRole('button', { name: 'Play' }).click();
    await expect(page.getByTestId('slide-game')).toBeVisible();
    await expect(page.getByTestId('slide-moves')).toHaveText('Moves: 0');

    const tiles = page.getByRole('button', { name: /^Tile \d+$/ });
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThan(0);

    for (let index = 0; index < tileCount; index += 1) {
      const tile = tiles.nth(index);
      const movesBefore = await page.getByTestId('slide-moves').innerText();
      await tile.click();
      const movesAfter = await page.getByTestId('slide-moves').innerText();
      if (movesAfter !== movesBefore) break;
    }

    await expect(page.getByTestId('slide-moves')).not.toHaveText('Moves: 0');
  });
});
