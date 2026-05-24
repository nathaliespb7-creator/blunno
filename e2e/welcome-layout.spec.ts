import { expect, gotoAndSettle, test } from './helpers';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14 Pro', width: 393, height: 852 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
] as const;

const MIN_COPY_CTA_GAP = 28;

for (const viewport of VIEWPORTS) {
  test.describe(`Welcome layout — ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('subtitle and Start Now have safe spacing, no horizontal overflow', async ({ page }) => {
      await gotoAndSettle(page, '/');

      const subtitle = page.getByText('Your pocket reset for study stress');
      const startNow = page.getByRole('link', { name: 'Start Now' });

      await expect(subtitle).toBeVisible();
      await expect(startNow).toBeVisible();

      const subtitleBox = await subtitle.boundingBox();
      const ctaBox = await startNow.boundingBox();
      expect(subtitleBox).not.toBeNull();
      expect(ctaBox).not.toBeNull();
      if (!subtitleBox || !ctaBox) return;

      const gap = ctaBox.y - (subtitleBox.y + subtitleBox.height);
      expect(gap).toBeGreaterThanOrEqual(MIN_COPY_CTA_GAP);

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 1);
    });
  });
}
