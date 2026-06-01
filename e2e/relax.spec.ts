import {
  clickMood,
  clickStartNow,
  expect,
  gotoAndSettle,
  precacheForOffline,
  test,
  waitForServiceWorker,
} from './helpers';

const SOUNDS = ['Birch Wind', 'Ocean Waves', 'Rain Sounds', 'Meditation', 'Soft Storm'] as const;

test.describe('Relax sound controls', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');
  });

  for (const name of SOUNDS) {
    test(`loads ${name} audio when played`, async ({ page }) => {
      await page.getByRole('button', { name: `Play ${name}` }).click();
      await expect(page.getByRole('button', { name: `Pause ${name}` })).toBeVisible();
    });
  }

  for (const name of SOUNDS) {
    test(`play, pause and adjust volume for ${name}`, async ({ page }) => {
      const playButton = page.getByRole('button', { name: `Play ${name}` });
      await expect(playButton).toBeVisible();
      await playButton.click();

      const pauseButton = page.getByRole('button', { name: `Pause ${name}` });
      await expect(pauseButton).toBeVisible();
      await expect(page.getByRole('slider', { name: `${name} volume` })).toBeVisible();

      const slider = page.getByRole('slider', { name: `${name} volume` });
      await slider.fill('40');
      await expect(slider).toHaveValue('40');

      await pauseButton.click();
      await expect(page.getByRole('button', { name: `Play ${name}` })).toBeVisible();
    });
  }

  test('switches tracks quickly with immediate pause UI', async ({ page }) => {
    await page.getByRole('button', { name: 'Play Birch Wind' }).click();
    await expect(page.getByRole('button', { name: 'Pause Birch Wind' })).toBeVisible();

    await page.getByRole('button', { name: 'Play Ocean Waves' }).click();
    await expect(page.getByRole('button', { name: 'Pause Ocean Waves' })).toBeVisible({
      timeout: 500,
    });
    await expect(page.getByRole('button', { name: 'Play Birch Wind' })).toBeVisible({
      timeout: 500,
    });
  });

  test('plays relax tracks while offline after precache', async ({ page, context }) => {
    await gotoAndSettle(page, '/');
    await waitForServiceWorker(page);
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await precacheForOffline(page);

    for (const name of SOUNDS) {
      await page.getByRole('button', { name: `Play ${name}` }).click();
      await expect(page.getByRole('button', { name: `Pause ${name}` })).toBeVisible({
        timeout: 10_000,
      });
      await page.getByRole('button', { name: `Pause ${name}` }).click();
      await expect(page.getByRole('button', { name: `Play ${name}` })).toBeVisible();
    }

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL('/relax');

    for (const name of SOUNDS) {
      await page.getByRole('button', { name: `Play ${name}` }).click();
      await expect(page.getByRole('button', { name: `Pause ${name}` })).toBeVisible({
        timeout: 10_000,
      });
      await page.getByRole('button', { name: `Pause ${name}` }).click();
      await expect(page.getByRole('button', { name: `Play ${name}` })).toBeVisible();
    }
  });

  test('keeps playback after navigating away and back to Relax', async ({ page }) => {
    await page.getByRole('button', { name: 'Play Birch Wind' }).click();
    await expect(page.getByRole('button', { name: 'Pause Birch Wind' })).toBeVisible();

    await page.getByRole('link', { name: 'Back to mode selection' }).click();
    await expect(page).toHaveURL('/choose');

    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');

    await page.getByRole('button', { name: 'Play Ocean Waves' }).click();
    await expect(page.getByRole('button', { name: 'Pause Ocean Waves' })).toBeVisible();

    await expect(page.getByRole('slider', { name: 'Ocean Waves volume' })).toBeVisible();
  });
});
