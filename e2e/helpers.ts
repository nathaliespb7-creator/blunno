import { expect, test as base, type Page } from '@playwright/test';

const IGNORED_CONSOLE_PATTERNS = [
  /Download the React DevTools/,
  /Failed to load resource.*favicon/,
  /AudioContext was not allowed to start/,
  /The play\(\) request was interrupted/,
];

export class ConsoleErrorCollector {
  private errors: string[] = [];

  constructor(private readonly page: Page) {}

  attach(): void {
    this.page.on('pageerror', (error) => {
      this.errors.push(`pageerror: ${error.message}`);
    });

    this.page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))) return;
      this.errors.push(`console.error: ${text}`);
    });
  }

  expectNone(): void {
    expect(this.errors, `Unexpected console/page errors:\n${this.errors.join('\n')}`).toEqual([]);
  }
}

export const test = base.extend<{ collector: ConsoleErrorCollector }>({
  collector: async ({ page }, use) => {
    const collector = new ConsoleErrorCollector(page);
    collector.attach();
    await use(collector);
    collector.expectNone();
  },
});

export { expect } from '@playwright/test';

export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

export async function clickTryBlunno(page: Page): Promise<void> {
  const link = page.getByRole('link', { name: 'Try Blunno' });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await page.waitForURL(/\/app\/?$/, { waitUntil: 'commit' });
}

export async function clickStartNow(page: Page): Promise<void> {
  const tryBlunno = page.getByRole('link', { name: 'Try Blunno' });
  if (await tryBlunno.isVisible().catch(() => false)) {
    await clickTryBlunno(page);
  }

  const link = page.getByRole('link', { name: 'Start Now' });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await page.waitForURL(/\/choose\/?$/, { waitUntil: 'commit' });
}

/** @deprecated Use clickStartNow — enters app from landing then opens choose */
export async function clickOpenBlunno(page: Page): Promise<void> {
  await clickStartNow(page);
}

export async function clickMood(page: Page, moodLabel: string): Promise<void> {
  await page.getByRole('link', { name: new RegExp(`^${moodLabel}$`, 'i') }).click();
  await page.waitForURL((url) => url.pathname !== '/choose', { waitUntil: 'commit' });
}

export function gameCard(page: Page, title: string) {
  return page.locator('.v81-glass-cell').filter({ has: page.getByRole('heading', { name: title, level: 3 }) });
}

/** Waits until a service worker controls the page (production `next start` only). */
export async function waitForServiceWorker(page: Page): Promise<void> {
  await page.waitForFunction(
    () => typeof navigator !== 'undefined' && navigator.serviceWorker?.controller != null,
    undefined,
    { timeout: 30_000 }
  );
}

/** Triggers SW install/precache by visiting key routes while online. */
export async function precacheForOffline(page: Page): Promise<void> {
  await waitForServiceWorker(page);
  await gotoAndSettle(page, '/relax');
  await page.waitForTimeout(500);
}
