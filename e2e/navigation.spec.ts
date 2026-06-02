import { clickMood, clickStartNow, clickTryBlunno, expect, gotoAndSettle, test } from './helpers';

test.describe('Navigation matrix', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
  });

  test('Landing → App → Choose via Try Blunno and Start Now', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blunno', level: 1 })).toBeVisible();
    await clickTryBlunno(page);
    await expect(page).toHaveURL('/app');
    await clickStartNow(page);
    await expect(page.getByRole('heading', { name: 'Choose Your Mood' })).toBeVisible();
  });

  test('Choose → App via Home', async ({ page }) => {
    await clickStartNow(page);
    await page.getByRole('link', { name: 'Exit to welcome screen' }).click();
    await expect(page).toHaveURL('/app');
    await expect(page.getByRole('link', { name: 'Start Now' })).toBeVisible();
  });

  test('Choose → SOS → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'SOS');
    await expect(page).toHaveURL('/sos');
    await expect(page.getByLabel('SOS breathing exercise')).toBeVisible();
    await page.getByRole('link', { name: 'Exit to mode selection' }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('Choose → Planner → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'PLANNER');
    await expect(page).toHaveURL('/planner');
    await expect(page.getByText("Today's plan")).toBeVisible();
    await page.getByRole('link', { name: 'Exit to mode selection' }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('Choose → Play → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'PLAY');
    await expect(page).toHaveURL('/play');
    await expect(page.getByRole('heading', { name: 'Mini Games' })).toBeVisible();
    await page.getByRole('link', { name: 'Exit to mode selection' }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('Choose → Relax → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');
    await expect(page.getByRole('heading', { name: 'Relax' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to mode selection' }).click();
    await expect(page).toHaveURL('/choose');
  });
});
