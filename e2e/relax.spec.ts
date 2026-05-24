import { clickMood, clickStartNow, expect, gotoAndSettle, test } from './helpers';

const SOUNDS = ['Birch Wind', 'Ocean Waves', 'Rain Sounds', 'Meditation', 'Soft Storm'] as const;

test.describe('Relax sound controls', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');
  });

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

  test('loads Soft Storm audio when played', async ({ page }) => {
    const audioRequest = page.waitForRequest((req) => req.url().includes('/audio/relax/soft-storm.mp3'));
    await page.getByRole('button', { name: 'Play Soft Storm' }).click();
    await audioRequest;
  });

  test('loads Ocean Waves audio when played', async ({ page }) => {
    const audioRequest = page.waitForRequest((req) => req.url().includes('/audio/relax/ocean.mp3'));
    await page.getByRole('button', { name: 'Play Ocean Waves' }).click();
    await audioRequest;
  });

  test('loads Meditation audio when played', async ({ page }) => {
    const audioRequest = page.waitForRequest((req) => req.url().includes('/audio/relax/meditation.mp3'));
    await page.getByRole('button', { name: 'Play Meditation' }).click();
    await audioRequest;
  });

  test('loads Rain Sounds audio when played', async ({ page }) => {
    const audioRequest = page.waitForRequest((req) => req.url().includes('/audio/relax/rain.mp3'));
    await page.getByRole('button', { name: 'Play Rain Sounds' }).click();
    await audioRequest;
  });

  test('loads Birch Wind audio when played', async ({ page }) => {
    const audioRequest = page.waitForRequest((req) => req.url().includes('/audio/relax/birch-wind.mp3'));
    await page.getByRole('button', { name: 'Play Birch Wind' }).click();
    await audioRequest;
  });
});
