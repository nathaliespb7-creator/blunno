import { clickMood, clickStartNow, expect, gotoAndSettle, test } from './helpers';

test.describe('Planner interactions', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'PLANNER');
    await expect(page).toHaveURL('/planner');
  });

  test('week navigation, add task, complete and edit', async ({ page }) => {
    const weekLabel = page.locator('span').filter({ hasText: /^Week \d+$/ });
    const weekBefore = await weekLabel.textContent();

    await page.getByRole('button', { name: 'Next week' }).click();
    await expect(weekLabel).not.toHaveText(weekBefore ?? '');

    await page.getByRole('button', { name: 'Previous week' }).click();
    await expect(weekLabel).toHaveText(weekBefore ?? '');

    const taskText = `E2E task ${Date.now()}`;
    await page.getByPlaceholder('Add a new task...').fill(taskText);
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toBeVisible();

    await page.getByRole('button', { name: `Mark complete: ${taskText}` }).click();
    await expect(page.getByRole('button', { name: `Mark incomplete: ${taskText}` })).toBeVisible();

    await page.getByRole('button', { name: `Edit ${taskText}` }).click();
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
    await page.getByPlaceholder('Add a new task...').fill(`Extra task ${index}`);
    await page.getByRole('button', { name: 'Add Task' }).click();
    }

    await expect(page.getByRole('textbox', { name: 'Add a new task' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Add Task' })).toBeDisabled();
  });

  test('keeps tasks isolated per day', async ({ page }) => {
    const taskText = `Day task ${Date.now()}`;
    await page.getByPlaceholder('Add a new task...').fill(taskText);
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toBeVisible();

    await page.locator('.v81-planner-day').nth(1).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toHaveCount(0);
  });

  test('persists edited task text after reload', async ({ page }) => {
    const taskText = `Persistent task ${Date.now()}`;
    const editedText = `${taskText} saved`;

    await page.getByPlaceholder('Add a new task...').fill(taskText);
    await page.getByRole('button', { name: 'Add Task' }).click();
    await expect(page.getByRole('button', { name: taskText, exact: true })).toBeVisible();

    await page.getByRole('button', { name: `Edit ${taskText}` }).click();
    const editInput = page.locator('.v81-glass-cell input.rounded-lg');
    await editInput.fill(editedText);
    await editInput.press('Enter');
    await expect(page.getByRole('button', { name: editedText, exact: true })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('button', { name: editedText, exact: true })).toBeVisible();
  });
});
