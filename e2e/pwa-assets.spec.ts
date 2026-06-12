import { expect, gotoAndSettle, test, UI_SOUND_ASSETS, expectAssetsReachable } from './helpers';

test.describe('PWA asset availability', () => {
  test('manifest and icons are reachable', async ({ page }) => {
    await gotoAndSettle(page, '/');

    const manifest = await page.request.get('/manifest.webmanifest');
    expect(manifest.status()).toBe(200);
    const body = await manifest.json();
    expect(body.name).toBeTruthy();
    expect(body.start_url).toBe('/app');
    expect(body.display).toBe('standalone');

    for (const icon of ['/icon-192.png', '/icon-512.png', '/icon-512-maskable.png', '/apple-touch-icon.png']) {
      const response = await page.request.get(icon);
      expect(response.status(), icon).toBe(200);
    }
  });

  test('UI sound assets return 200', async ({ page }) => {
    await gotoAndSettle(page, '/');
    await expectAssetsReachable(page, UI_SOUND_ASSETS);
  });

  test('service worker and precache manifest are reachable', async ({ page }) => {
    await gotoAndSettle(page, '/');

    const sw = await page.request.get('/sw.js');
    expect(sw.status()).toBe(200);
    expect(await sw.text()).toContain('blunno-static-v');

    const precache = await page.request.get('/precache-manifest.json');
    expect(precache.status()).toBe(200);
    const manifest = await precache.json();
    expect(manifest.routes).toContain('/choose');
    expect(manifest.routes).toContain('/privacy');
  });
});
