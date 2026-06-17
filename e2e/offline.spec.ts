import {
  clickMood,
  clickStartNow,
  expect,
  expectChooseMoodsVisible,
  gotoAndSettle,
  precacheForOffline,
  test,
  T,
} from './helpers';

const OFFLINE_ROUTES = [
  { path: '/app', assert: async (page: import('@playwright/test').Page) => {
    await expect(page.getByRole('button', { name: T.startNow })).toBeVisible();
  }},
  { path: '/choose', assert: async (page: import('@playwright/test').Page) => {
    await expect(page.getByRole('heading', { name: T.chooseTitle })).toBeVisible();
  }},
  { path: '/sos', assert: async (page: import('@playwright/test').Page) => {
    await expect(page.getByLabel(T.sosExercise)).toBeVisible();
  }},
  { path: '/planner', assert: async (page: import('@playwright/test').Page) => {
    await expect(page.getByText(T.plannerToday)).toBeVisible();
  }},
  { path: '/play', assert: async (page: import('@playwright/test').Page) => {
    await expect(page.getByRole('heading', { name: T.playTitle })).toBeVisible();
  }},
  { path: '/relax', assert: async (page: import('@playwright/test').Page) => {
    await expect(page.getByRole('heading', { name: T.relaxTitle })).toBeVisible();
  }},
] as const;

test.describe('Offline route availability', () => {
  test.describe.configure({ timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await gotoAndSettle(page, '/app');
    await precacheForOffline(page);
  });

  for (const route of OFFLINE_ROUTES) {
    test(`loads ${route.path} while offline`, async ({ page, context }) => {
      await context.setOffline(true);
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(route.path);
      await route.assert(page);
    });
  }

  test('can enter play hub offline after precache', async ({ page, context }) => {
    await context.setOffline(true);
    await gotoAndSettle(page, '/');
    await clickStartNow(page);
    await clickMood(page, 'PLAY');
    await expect(page).toHaveURL('/play');
    await expect(page.getByTestId('play-game-grid')).toBeVisible();
  });
});

test.describe('Offline transitions', () => {
  test.describe.configure({ timeout: 180_000 });

  test('choose mood tiles remain visible after repeated online/offline transitions', async ({
    page,
    context,
  }) => {
    await gotoAndSettle(page, '/app');
    await precacheForOffline(page);
    await page.goto('/choose', { waitUntil: 'domcontentloaded' });
    await expectChooseMoodsVisible(page);

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expectChooseMoodsVisible(page);

    await context.setOffline(false);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await clickMood(page, 'PLAY');
    await expect(page).toHaveURL('/play');
    await page.getByRole('button', { name: T.exitChoose }).click();
    await expect(page).toHaveURL('/choose');
  });
});
