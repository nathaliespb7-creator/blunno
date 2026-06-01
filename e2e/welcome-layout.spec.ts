import { expect, gotoAndSettle, test } from './helpers';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`Landing layout — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('hero, CTAs, and no horizontal overflow', async ({ page }) => {
      await gotoAndSettle(page, '/');

      const headline = page.getByRole('heading', {
        name: 'Your pocket reset for study stress',
        level: 1,
      });
      const tryBlunno = page.getByRole('link', { name: 'Try Blunno' });
      const openBlunno = page.getByRole('link', { name: 'Open Blunno' });

      await expect(headline).toBeVisible();
      await expect(tryBlunno).toBeVisible();
      await openBlunno.scrollIntoViewIfNeeded();
      await expect(openBlunno).toBeVisible();

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 1);
    });
  });
}
