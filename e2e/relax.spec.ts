import {
  clickMood,
  clickRelaxPlay,
  clickStartNow,
  expect,
  gotoAndSettle,
  precacheForOffline,
  test,
  T,
} from './helpers';

test.describe('Relax sound controls', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');
    await expect(page.getByTestId('relax-sound-list')).toBeVisible();
  });

  for (const name of T.relaxSounds) {
    test(`loads ${name} audio when played`, async ({ page }) => {
      await clickRelaxPlay(page, name);
    });
  }

  for (const name of T.relaxSounds) {
    test(`play, pause and adjust volume for ${name}`, async ({ page }) => {
      await clickRelaxPlay(page, name);

      const pauseButton = page.getByRole('button', { name: T.relaxPause(name) });
      await expect(page.getByRole('slider', { name: T.relaxVolume(name) })).toBeVisible();

      const slider = page.getByRole('slider', { name: T.relaxVolume(name) });
      await slider.fill('40');
      await expect(slider).toHaveValue('40');

      await pauseButton.click();
      await expect(page.getByRole('button', { name: T.relaxPlay(name) })).toBeVisible();
    });
  }

  test('switches tracks quickly with immediate pause UI', async ({ page }) => {
    const first = T.relaxSounds[0];
    const second = T.relaxSounds[1];

    await clickRelaxPlay(page, first);
    await clickRelaxPlay(page, second);
    await expect(page.getByRole('button', { name: T.relaxPause(second) })).toBeVisible({
      timeout: 500,
    });
    await expect(page.getByRole('button', { name: T.relaxPlay(first) })).toBeVisible({
      timeout: 500,
    });
  });

  test('keeps playback after navigating away and back to Relax', async ({ page }) => {
    const first = T.relaxSounds[0];
    const second = T.relaxSounds[1];

    await clickRelaxPlay(page, first);

    await page.getByRole('button', { name: T.backChoose }).click();
    await expect(page).toHaveURL('/choose');

    await clickMood(page, 'RELAX');
    await expect(page).toHaveURL('/relax');

    await clickRelaxPlay(page, second);
    await expect(page.getByRole('slider', { name: T.relaxVolume(second) })).toBeVisible();
  });
});

test.describe('Relax offline playback', () => {
  test.describe.configure({ timeout: 180_000 });

  test('plays relax tracks while offline after precache', async ({ page, context }) => {
    await gotoAndSettle(page, '/app');
    await precacheForOffline(page);
    await page.goto('/relax', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL('/relax');
    await expect(page.getByTestId('relax-sound-list')).toBeVisible();

    for (const name of T.relaxSounds) {
      await clickRelaxPlay(page, name);
      await page.getByRole('button', { name: T.relaxPause(name) }).click();
      await expect(page.getByRole('button', { name: T.relaxPlay(name) })).toBeVisible();
    }

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL('/relax');

    for (const name of T.relaxSounds) {
      await clickRelaxPlay(page, name);
      await page.getByRole('button', { name: T.relaxPause(name) }).click();
      await expect(page.getByRole('button', { name: T.relaxPlay(name) })).toBeVisible();
    }
  });
});
