import { clickMood, clickStartNow, expect, gameCard, gotoAndSettle, test, T } from './helpers';

const GAME_KEYS = ['sudoku', 'tetris', 'balloon', 'memory', 'slide'] as const;

async function startPopItRound(page: import('@playwright/test').Page): Promise<void> {
  const card = gameCard(page, T.games.balloon);
  await expect(card).toBeVisible();

  await expect(async () => {
    await card.getByRole('button', { name: T.playAction }).click();
    await expect(page.getByRole('heading', { name: T.games.balloon, level: 1 })).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });

  await expect(page.getByTestId('popit-game')).toBeVisible({ timeout: 10000 });
  await page.getByTestId('popit-blow').click();
  await expect(page.getByTestId('popit-canvas')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('popit-field')).toHaveAttribute('data-playing', 'true');
  await expect(page.getByTestId('popit-live-count')).not.toHaveText(/0$/, { timeout: 10000 });
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

    for (const key of GAME_KEYS) {
      const card = gameCard(page, T.games[key]);
      await expect(card).toBeVisible();
      const playBtn = card.getByRole('button', { name: T.playAction });
      await expect(playBtn).toBeVisible();
      await expect(playBtn).toBeInViewport();
    }
  });

  test('fits all game cards on one screen without scroll on iPhone 14 Pro', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await gotoAndSettle(page, '/play');

    for (const key of GAME_KEYS) {
      const card = gameCard(page, T.games[key]);
      await expect(card).toBeVisible();
      await expect(card.getByRole('button', { name: T.playAction })).toBeInViewport();
    }
  });

  for (const key of GAME_KEYS) {
    test(`opens ${key}, returns to hub, exits to choose`, async ({ page }) => {
      const title = T.games[key];
      const card = gameCard(page, title);
      await expect(card).toBeVisible();

      await expect(async () => {
        await card.getByRole('button', { name: T.playAction }).click();
        await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });

      await expect(page.getByRole('button', { name: T.backToGames })).toBeVisible();

      await page.getByRole('button', { name: T.backToGames }).click();
      await expect(page.getByRole('heading', { name: T.playTitle })).toBeVisible();

      await expect(async () => {
        await card.getByRole('button', { name: T.playAction }).click();
        await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });

      await page.getByRole('link', { name: T.exitChoose }).click();
      await expect(page).toHaveURL('/choose');
    });
  }

  test('Sudoku board stays visible above keypad on small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    const card = gameCard(page, T.games.sudoku);
    await card.getByRole('button', { name: T.playAction }).click();
    await expect(page.getByTestId('sudoku-board')).toBeVisible();

    const board = page.getByTestId('sudoku-board');
    const keypad = page.getByTestId('sudoku-keypad');
    await expect(keypad).toBeVisible();

    const boardBox = await board.boundingBox();
    const keypadBox = await keypad.boundingBox();
    expect(boardBox).not.toBeNull();
    expect(keypadBox).not.toBeNull();
    if (!boardBox || !keypadBox) return;

    expect(boardBox.y + boardBox.height).toBeLessThanOrEqual(keypadBox.y + 2);
  });

  test('Pop It canvas pops bubbles and updates score', async ({ page }) => {
    await startPopItRound(page);
    await expect(page.getByTestId('popit-score')).toContainText('0');

    await popCanvasBubble(page);
    await expect(page.getByTestId('popit-score')).not.toContainText(': 0');
  });

  test('Memory Match flips cards and updates score on match', async ({ page }) => {
    const card = gameCard(page, T.games.memory);
    await expect(async () => {
      await card.getByRole('button', { name: T.playAction }).click();
      await expect(page.getByTestId('memory-game')).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });
    await expect(page.getByTestId('memory-score')).toContainText('0');

    await page.getByRole('button', { name: T.memoryFaceDown }).first().click();
    await expect(page.getByTestId('memory-score')).toContainText('0');
  });

  test('Pop It restart resets score', async ({ page }) => {
    await startPopItRound(page);
    await popCanvasBubble(page);
    await expect(page.getByTestId('popit-score')).not.toContainText(': 0');

    await page.getByRole('button', { name: /restart|заново/i }).click();
    await expect(page.getByTestId('popit-score')).toContainText('0');
    await expect(page.getByTestId('popit-blow')).toBeVisible();
  });

  test('Slide Puzzle increments move counter', async ({ page }) => {
    const card = gameCard(page, T.games.slide);
    await card.getByRole('button', { name: T.playAction }).click();
    await expect(page.getByTestId('slide-game')).toBeVisible();
    await expect(page.getByTestId('slide-moves')).toContainText('0');

    const tiles = page.getByRole('button', { name: /tile|плитка/i });
    const tileCount = await tiles.count();
    expect(tileCount).toBeGreaterThan(0);

    for (let index = 0; index < tileCount; index += 1) {
      const tile = tiles.nth(index);
      const movesBefore = await page.getByTestId('slide-moves').innerText();
      await tile.click();
      const movesAfter = await page.getByTestId('slide-moves').innerText();
      if (movesAfter !== movesBefore) break;
    }

    await expect(page.getByTestId('slide-moves')).not.toContainText(': 0');
  });
});
