import { expect, test as base, type Page } from '@playwright/test';

const IGNORED_CONSOLE_PATTERNS = [
  /Download the React DevTools/,
  /Failed to load resource.*favicon/,
  /AudioContext was not allowed to start/,
  /The play\(\) request was interrupted/,
  /\[audio\] failed loading/,
  /\[audio\] failed playing/,
];

/** Default to Russian for RuStore release gate; set E2E_LOCALE=en for English smoke. */
export const E2E_LOCALE = process.env.E2E_LOCALE === 'en' ? 'en' : 'ru';

export const STR = {
  en: {
    tryBlunno: 'Try Blunno',
    startNow: 'Start Now',
    chooseTitle: 'Choose Your Mood',
    exitChoose: 'Exit to mode selection',
    homeExit: 'Exit to mode selection',
    backChoose: 'Back to mode selection',
    moods: { SOS: 'SOS', PLANNER: 'PLANNER', PLAY: 'PLAY', RELAX: 'RELAX' },
    playTitle: 'Play',
    playHubTitle: 'Play',
    playSubtitle: 'Take a break with mini-games',
    backToGames: 'Back to games',
    playAction: 'Play',
    games: {
      sudoku: 'Sudoku',
      tetris: 'Tetris',
      balloon: 'Pop It',
      memory: 'Memory Match',
      slide: 'Slide Puzzle',
    },
    relaxTitle: 'Relax',
    relaxSounds: ['Birch Wind', 'Ocean Waves', 'Rain Sounds', 'Meditation', 'Soft Storm'] as const,
    relaxPlay: (name: string) => `Play ${name}`,
    relaxPause: (name: string) => `Pause ${name}`,
    relaxVolume: (name: string) => `${name} volume`,
    plannerToday: "Today's plan",
    plannerWeek: /^Week \d+$/,
    plannerNextWeek: 'Next week',
    plannerPrevWeek: 'Previous week',
    plannerAddPlaceholder: 'Add a new task...',
    plannerAddField: 'Add a new task',
    plannerAddTask: 'Add Task',
    plannerComplete: 'Mark complete',
    plannerUncomplete: 'Mark incomplete',
    plannerEdit: 'Edit task',
    sosExercise: 'SOS breathing exercise',
    sosTapStart: 'Tap to start breathing exercise',
    sosCycle: /Cycle 1 of 3/,
    sosInhale: 'Inhale',
    sosBreath: 'Breath 1 of 2',
    sosTrace: 'Trace the ring with your finger to begin',
    sosStop: 'Stop',
    memoryFaceDown: 'Face-down card',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    landingTitle: 'Blunno',
  },
  ru: {
    tryBlunno: 'Попробовать Blunno',
    startNow: 'Начать',
    chooseTitle: 'Выбери настроение',
    exitChoose: 'Выйти в меню',
    homeExit: 'Выйти в меню',
    backChoose: 'Назад',
    moods: { SOS: 'SOS', PLANNER: 'ПЛАННЕР', PLAY: 'ИГРЫ', RELAX: 'ОТДЫХ' },
    playTitle: 'Игры',
    playHubTitle: 'Игры',
    playSubtitle: 'Сделай паузу с мини-играми',
    backToGames: 'Назад к играм',
    playAction: 'Играть',
    games: {
      sudoku: 'Судоку',
      tetris: 'Тетрис',
      balloon: 'Лопни шарик',
      memory: 'Найди пару',
      slide: 'Пятнашки',
    },
    relaxTitle: 'Отдых',
    relaxSounds: ['Ветер', 'Океанские волны', 'Шум дождя', 'Медитация', 'Лёгкий шторм'] as const,
    relaxPlay: (name: string) => `Включить ${name}`,
    relaxPause: (name: string) => `Пауза ${name}`,
    relaxVolume: (name: string) => `${name} громкость`,
    plannerToday: 'План на сегодня',
    plannerWeek: /^Неделя \d+$/,
    plannerNextWeek: 'Следующая неделя',
    plannerPrevWeek: 'Предыдущая неделя',
    plannerAddPlaceholder: 'Добавить задачу...',
    plannerAddField: 'Добавить задачу',
    plannerAddTask: 'Добавить задачу',
    plannerComplete: 'Выполнено',
    plannerUncomplete: 'Вернуть',
    plannerEdit: 'Редактировать',
    sosExercise: 'Дыхательное упражнение SOS',
    sosTapStart: 'Нажми, чтобы начать дыхание',
    sosCycle: /Цикл 1 из 3/,
    sosInhale: 'Вдох',
    sosBreath: 'Вдох 1 из 2',
    sosTrace: 'Веди пальцем по кольцу чтобы начать',
    sosStop: 'Стоп',
    memoryFaceDown: 'Закрытая карточка',
    cookieAccept: 'Принять',
    cookieDecline: 'Отказаться',
    landingTitle: 'Blunno',
  },
} as const;

export const T = STR[E2E_LOCALE];

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
  page: async ({ page }, use) => {
    await page.addInitScript(({ locale }) => {
      try {
        localStorage.setItem('blunno_analytics_consent', 'denied');
        localStorage.setItem('blunno_lang', locale);
      } catch {
        /* private mode */
      }
    }, { locale: E2E_LOCALE });
    await use(page);
  },
  collector: async ({ page }, use) => {
    const collector = new ConsoleErrorCollector(page);
    collector.attach();
    await use(collector);
    collector.expectNone();
  },
});

export { expect } from '@playwright/test';

export async function setLocaleCookie(page: Page, locale: 'en' | 'ru' = E2E_LOCALE): Promise<void> {
  await page.context().addCookies([
    {
      name: 'blunno_lang',
      value: locale,
      domain: 'localhost',
      path: '/',
    },
  ]);
}

export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  await setLocaleCookie(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load').catch(() => undefined);
}

export async function expectChooseMoodsVisible(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: T.chooseTitle })).toBeVisible();
  await expect(page.locator('.v81-glass-cell')).toHaveCount(4);
  for (const mood of Object.values(T.moods)) {
    await expect(page.getByRole('button', { name: new RegExp(`^${mood}$`, 'i') })).toBeVisible();
  }
}

export async function clickTryBlunno(page: Page): Promise<void> {
  const btn = page.getByRole('button', { name: T.tryBlunno });
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForURL(/\/app\/?$/, { waitUntil: 'commit' });
}

export async function clickStartNow(page: Page): Promise<void> {
  const tryBlunno = page.getByRole('button', { name: T.tryBlunno });
  if (await tryBlunno.isVisible().catch(() => false)) {
    await clickTryBlunno(page);
  }

  const btn = page.getByRole('button', { name: T.startNow });
  await btn.scrollIntoViewIfNeeded();
  await btn.click();
  await page.waitForURL(/\/choose\/?$/, { waitUntil: 'commit' });
}

/** @deprecated Use clickStartNow — enters app from landing then opens choose */
export async function clickOpenBlunno(page: Page): Promise<void> {
  await clickStartNow(page);
}

export async function clickMood(page: Page, moodKey: keyof typeof T.moods): Promise<void> {
  await page.getByRole('button', { name: new RegExp(`^${T.moods[moodKey]}$`, 'i') }).click();
  await page.waitForURL((url) => url.pathname !== '/choose', { waitUntil: 'commit' });
}

export function gameCard(page: Page, title: string) {
  return page.locator('.v81-glass-cell').filter({ has: page.getByRole('heading', { name: title, level: 3 }) });
}

export async function clickRelaxPlay(page: Page, name: string): Promise<void> {
  const playButton = page.getByRole('button', { name: T.relaxPlay(name) });
  const pauseButton = page.getByRole('button', { name: T.relaxPause(name) });
  await expect(playButton).toBeVisible();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await playButton.click();
    try {
      await expect(pauseButton).toBeVisible({ timeout: 10_000 });
      return;
    } catch {
      if (attempt === 1) throw new Error(`Relax track "${name}" did not enter playing state`);
    }
  }
}

/** Waits until a service worker controls the page (production `next start` only). */
export async function waitForServiceWorker(page: Page): Promise<void> {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (await page.evaluate(() => Boolean(navigator.serviceWorker?.controller))) return;
    await page.waitForTimeout(250);
  }

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => typeof navigator !== 'undefined' && navigator.serviceWorker?.controller != null,
    undefined,
    { timeout: 20_000 }
  );
}

const OFFLINE_ROUTES = ['/', '/app', '/choose', '/sos', '/planner', '/play', '/relax', '/offline'] as const;

/** Triggers SW install/precache by visiting all key routes while online. */
export async function precacheForOffline(page: Page): Promise<void> {
  await waitForServiceWorker(page);
  for (const route of OFFLINE_ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
  }
  await page.goto('/app', { waitUntil: 'domcontentloaded' });
}

export const UI_SOUND_ASSETS = [
  '/sounds/hover-soft.mp3',
  '/sounds/inhale.mp3',
  '/sounds/exhale.mp3',
  '/audio/pop.mp3',
] as const;

export async function expectAssetsReachable(page: Page, urls: readonly string[]): Promise<void> {
  for (const url of urls) {
    const response = await page.request.get(url);
    expect(response.status(), `${url} should return 200`).toBe(200);
  }
}
