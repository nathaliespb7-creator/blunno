import { expect, gotoAndSettle, test, T } from './helpers';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`Landing layout — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('hero, CTA, and no horizontal overflow', async ({ page }) => {
      await gotoAndSettle(page, '/');

      const headline = page.getByRole('heading', { name: T.landingTitle, level: 1 });
      const tryBlunno = page.getByRole('link', { name: T.tryBlunno });

      await expect(headline).toBeVisible();
      await expect(tryBlunno).toBeVisible();

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 1);
    });
  });
}
