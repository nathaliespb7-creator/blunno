import { clickStartNow, expect, gotoAndSettle, test, T } from './helpers';

const VIEWPORTS = [
  { name: 'Android small', width: 360, height: 640 },
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`Choose layout — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test.beforeEach(async ({ page }) => {
      await gotoAndSettle(page, '/');
      await clickStartNow(page);
      await expect(page).toHaveURL('/choose');
    });

    test('shows all four mood tiles without clipping', async ({ page }) => {
      const tiles = page.locator('.v81-glass-cell');
      await expect(tiles).toHaveCount(4);

      for (const mood of Object.values(T.moods)) {
        const tile = page.getByRole('link', { name: new RegExp(`^${mood}$`, 'i') });
        await expect(tile).toBeVisible();
        await expect(tile).toBeInViewport();
      }
    });

    test('survives repeated navigation to play and back', async ({ page }) => {
      for (let cycle = 0; cycle < 3; cycle += 1) {
        await page.getByRole('link', { name: new RegExp(`^${T.moods.PLAY}$`, 'i') }).click();
        await expect(page).toHaveURL('/play');
        await page.getByRole('link', { name: T.exitChoose }).click();
        await expect(page).toHaveURL('/choose');
        await expect(page.locator('.v81-glass-cell')).toHaveCount(4);
      }
    });
  });
}
