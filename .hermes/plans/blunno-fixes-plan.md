# Blunno — План финальных исправлений

## Проблема 1: Чёлка (notch) видна на ВСЕХ экранах

**Причина:** Три разных цвета фона в разных местах приложения.
- Landing/welcome: `html.landing-route { background: #05050A }` (globals.css:288)
- App screens: `html { background: #120f25 }` (globals.css:279)
- themeColor: `#0a0815` (layout.tsx)
- Градиент экранов: от `#0a0815` до `#120f25`

**Исправление:**
1. Унифицировать фон: убрать `html.landing-route` и `html.welcome-route` отдельные цвета
2. Везде использовать `#120f25` как базовый фон html
3. themeColor = `#120f25`
4. Файлы: `app/globals.css` (строки 288-293), `app/layout.tsx` (темаColor)

---

## Проблема 2: Landing page другого цвета

**Причина:** Хардкод `bg-[#05050A]` в `app/page.tsx` и `html.landing-route` в CSS.

**Исправление:**
1. Убрать `bg-[#05050A]` из `app/page.tsx`
2. Использовать `bg-blunno-bg` или CSS-переменные
3. Файл: `app/page.tsx`

---

## Проблема 3: Громкость Relax не работает на iOS

**Причина:** Недавно заменили `<input type="range">` на PointerEvent-обработчики. Возможные баги: track div не получает фокус, pointer capture не срабатывает, или makeVolumeHandlers создаётся заново на каждом рендере (нет useCallback/useMemo).

**Исправление:**
1. Обернуть makeVolumeHandlers в useCallback
2. Добавить onClick как fallback для PointerEvent
3. Проверить, что track div имеет правильный cursor: pointer
4. Файл: `app/relax/page.tsx`

---

## Проблема 4: Медленные переходы между экранами

**Причина:** Возможно несколько:
- WelcomeCTA теперь `<Link prefetch>` — prefetch может грузить лишнее
- Все страницы 'use client' — нет SSR
- 6 шрифтов всё ещё грузятся
- Аудиосервис preloadAll() при старте

**Исправление:**
1. Проверить консоль на JS-ошибки при переходах
2. Убедиться, что Link prefetch не блокирует рендер
3. Файлы: `src/components/features/welcome/WelcomeCTA.tsx`, `app/layout.tsx`

---

## Проблема 5: Маскот грузится с задержкой

**Причина:** Изображение маскота (`blunno-mascot-make-v23.png/webp`) не имеет preload.

**Исправление:**
1. Добавить `<link rel="preload" as="image">` для маскота в layout.tsx
2. Или использовать Next.js Image с priority
3. Файл: `app/layout.tsx`

---

## Порядок исправлений (по файлам)

### Файл 1: `app/globals.css`
- Удалить `html.landing-route` и `html.welcome-route` отдельные фоны (строки 288-301)
- Оставить только общий `html { background-color: #120f25 !important; }`

### Файл 2: `app/layout.tsx`
- themeColor = `#120f25` (not `#0a0815`)
- Добавить preload для mascot: `<link rel="preload" as="image" href="/blunno-mascot-make-v23.webp">`

### Файл 3: `app/page.tsx` (landing)
- Заменить `bg-[#05050A]` на `bg-blunno-bg`
- Заменить другие хардкод-цвета (#9CA3AF, #6B7280, #00FFFF) на CSS-переменные

### Файл 4: `app/relax/page.tsx`
- Обернуть makeVolumeHandlers в useCallback
- Добавить fallback onClick на track div
- Убедиться что track имеет `cursor: pointer` и `touch-action: none`

### Файл 5: `app/app/page.tsx` (welcome)
- Проверить что нет лишних импортов после предыдущих правок
- Убедиться что welcome-route класс всё ещё работает корректно
