import { clickMood, clickStartNow, clickTryBlunno, expect, gotoAndSettle, test, T } from './helpers';

test.describe('Navigation matrix', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
  });

  test('Landing → App → Choose via Try Blunno and Start Now', async ({ page }) => {
    await expect(page.getByRole('heading', { name: T.landingTitle, level: 1 })).toBeVisible();
    await clickTryBlunno(page);
    await expect(page).toHaveURL('/app');
    await clickStartNow(page);
    await expect(page.getByRole('heading', { name: T.chooseTitle })).toBeVisible();
  });

  test('Choose → App via Home', async ({ page }) => {
    await clickStartNow(page);
    await page.getByRole('link', { name: T.homeExit }).click();
    await expect(page).toHaveURL('/app');
    await expect(page.getByRole('link', { name: T.startNow })).toBeVisible();
  });

  test('Choose → SOS → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'SOS');
    await expect(page).toHaveURL('/sos');
    await expect(page.getByLabel(T.sosExercise)).toBeVisible();
    await page.getByRole('link', { name: T.exitChoose }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('Choose → Planner → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'PLANNER');
    await expect(page).toHaveURL('/planner');
    await expect(page.getByText(T.plannerToday)).toBeVisible();
    await page.getByRole('link', { name: T.exitChoose }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('Choose → Play → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'PLAY');
    await expect(page).toHaveURL('/play');
    await expect(page.getByRole('heading', { name: T.playTitle })).toBeVisible();
    await page.getByRole('link', { name: T.exitChoose }).click();
    await expect(page).toHaveURL('/choose');
  });

  test('Choose → Relax → back to Choose', async ({ page }) => {
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');
    await expect(page.getByRole('heading', { name: T.relaxTitle })).toBeVisible();
    await page.getByRole('link', { name: T.backChoose }).click();
    await expect(page).toHaveURL('/choose');
  });
});
