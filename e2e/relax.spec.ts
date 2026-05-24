import { clickMood, clickStartNow, expect, gotoAndSettle, test } from './helpers';

const SOUNDS = ['Birch Wind', 'Ocean Waves', 'Rain Sounds', 'Meditation', 'Soft Storm'] as const;

const AUDIO_FILES: Record<(typeof SOUNDS)[number], string> = {
  'Birch Wind': '/audio/relax/birch-wind.mp3',
  'Ocean Waves': '/audio/relax/ocean.mp3',
  'Rain Sounds': '/audio/relax/rain.mp3',
  Meditation: '/audio/relax/meditation.mp3',
  'Soft Storm': '/audio/relax/soft-storm.mp3',
};

test.describe('Relax sound controls', () => {
  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');
  });

  for (const name of SOUNDS) {
    test(`loads ${name} audio when played`, async ({ page }) => {
      const audioRequest = page.waitForRequest((req) => req.url().includes(AUDIO_FILES[name]));
      await page.getByRole('button', { name: `Play ${name}` }).click();
      await audioRequest;
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
});
