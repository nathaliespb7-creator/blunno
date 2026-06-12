import { clickMood, clickStartNow, expect, gotoAndSettle, test, T } from './helpers';

test.describe('Planner interactions', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'PLANNER');
    await expect(page).toHaveURL('/planner');
  });

  test('week navigation, add task, complete and edit', async ({ page }) => {
    const weekLabel = page.locator('span').filter({ hasText: T.plannerWeek });
    const weekBefore = await weekLabel.textContent();

    await page.getByRole('button', { name: T.plannerNextWeek }).click();
    await expect(weekLabel).not.toHaveText(weekBefore ?? '');

    await page.getByRole('button', { name: T.plannerPrevWeek }).click();
    await expect(weekLabel).toHaveText(weekBefore ?? '');

    const taskText = `E2E task ${Date.now()}`;
    await page.getByPlaceholder(T.plannerAddPlaceholder).fill(taskText);
    await page.getByRole('button', { name: T.plannerAddTask }).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toBeVisible();

    const row = page.locator('.v81-glass-cell').filter({ hasText: taskText });
    await row.getByRole('button', { name: T.plannerComplete }).click();
    await expect(row.getByRole('button', { name: T.plannerUncomplete })).toBeVisible();

    await row.getByRole('button', { name: T.plannerEdit }).click();
    const editInput = page.locator('.v81-glass-cell input.rounded-lg');
    await editInput.fill(`${taskText} edited`);
    await editInput.press('Enter');
    await expect(page.getByRole('button', { name: `${taskText} edited`, exact: true })).toBeVisible();
  });

  test('day selection switches planner day', async ({ page }) => {
    const dayButtons = page.locator('.v81-planner-day');
    const count = await dayButtons.count();
    expect(count).toBeGreaterThan(1);

    const secondDay = dayButtons.nth(1);
    await secondDay.click();
    await expect(secondDay).toBeVisible();
  });

  test('blocks adding more than 8 tasks', async ({ page }) => {
    for (let index = 1; index <= 3; index += 1) {
      await page.getByPlaceholder(T.plannerAddPlaceholder).fill(`Extra task ${index}`);
      await page.getByRole('button', { name: T.plannerAddTask }).click();
    }

    await expect(page.getByRole('textbox', { name: T.plannerAddField })).toBeDisabled();
    await expect(page.getByRole('button', { name: T.plannerAddTask })).toBeDisabled();
  });

  test('keeps tasks isolated per day', async ({ page }) => {
    const taskText = `Day task ${Date.now()}`;
    await page.getByPlaceholder(T.plannerAddPlaceholder).pressSequentially(taskText);
    await page.getByRole('button', { name: T.plannerAddTask }).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toBeVisible({
      timeout: 10_000,
    });

    await page.locator('.v81-planner-day').nth(1).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toHaveCount(0, {
      timeout: 10_000,
    });
  });

  test('persists edited task text after reload', async ({ page }) => {
    const taskText = `Persistent task ${Date.now()}`;
    const editedText = `${taskText} saved`;

    await page.getByPlaceholder(T.plannerAddPlaceholder).pressSequentially(taskText);
    await page.getByRole('button', { name: T.plannerAddTask }).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toBeVisible();

    const row = page.locator('.v81-glass-cell').filter({ hasText: taskText });
    await row.getByRole('button', { name: T.plannerEdit }).click();
    const editInput = page.locator('.v81-glass-cell input.rounded-lg');
    await editInput.click();
    await editInput.press('Meta+a');
    await editInput.pressSequentially(editedText);
    await editInput.press('Enter');
    await expect(page.getByRole('button', { name: editedText, exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('button', { name: editedText, exact: true })).toBeVisible();
  });
});
