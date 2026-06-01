import { chromium, devices } from '@playwright/test';

const DEBUG_ENDPOINT = 'http://127.0.0.1:7569/ingest/48470933-d439-4b67-9629-7611686a2ab6';

async function emit(message, data, hypothesisId = 'E') {
  await fetch(DEBUG_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5077d9' },
    body: JSON.stringify({
      sessionId: '5077d9',
      runId: 'pre-fix',
      hypothesisId,
      location: 'scripts/debug-viewport-probe.mjs',
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['Pixel 5'],
  userAgent:
    'Mozilla/5.0 (Linux; Android 10; HUAWEI VOG-L29) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.93 Mobile Safari/537.36',
});
const page = await context.newPage();
await page.goto('http://127.0.0.1:3000/?debugViewport=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const snapshot = await page.evaluate(() => {
  const welcomeScreen = document.querySelector('.welcome-screen');
  const welcomeFrame = document.querySelector('.welcome-frame');
  const startCta = document.querySelector('.welcome-cta');
  const rect = startCta?.getBoundingClientRect();
  const hit = rect
    ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
    : null;
  return {
    innerHeight: window.innerHeight,
    htmlClasses: document.documentElement.className,
    welcomeScreenHeight: welcomeScreen?.clientHeight ?? null,
    welcomeScreenPaddingTop: welcomeScreen ? getComputedStyle(welcomeScreen).paddingTop : null,
    welcomeScreenPaddingBottom: welcomeScreen ? getComputedStyle(welcomeScreen).paddingBottom : null,
    welcomeFrameHeight: welcomeFrame?.clientHeight ?? null,
    welcomeFrameBottom: welcomeFrame?.getBoundingClientRect().bottom ?? null,
    ctaBottom: rect?.bottom ?? null,
    ctaHitClass: hit?.className ?? null,
    topHitClass: document.elementFromPoint(window.innerWidth / 2, 8)?.className ?? null,
    bottomHitClass: document.elementFromPoint(window.innerWidth / 2, window.innerHeight - 8)?.className ?? null,
    maskCount: document.querySelectorAll('.android-edge-mask').length,
    maskPointerEvents: Array.from(document.querySelectorAll('.android-edge-mask')).map((el) =>
      getComputedStyle(el).pointerEvents,
    ),
  };
});

await emit('playwright huawei snapshot', snapshot, 'A');
await emit('playwright hit-test', snapshot, 'B');
await browser.close();

console.log(JSON.stringify(snapshot, null, 2));
