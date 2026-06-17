import type { Metadata } from 'next';

import { SeoFeatureCard, SeoLandingShell } from '@/components/features/seo/SeoLandingShell';
import { routeMetadata } from '@/lib/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = routeMetadata({
  path: '/focus',
  title: 'Звуки для концентрации',
  absoluteTitle: 'Звуки для концентрации и учёбы – Blunno',
  description:
    'Фоновые звуки для фокуса во время учёбы. Помогает при ADHD, повышает концентрацию. Работает офлайн.',
});

const RELAX_ACCENT = '#e7b453';

const SOUNDS = [
  {
    title: 'Берёзовый ветер',
    description: 'Мягкий шум ветра в листве — ненавязчивый фон для чтения и конспектов.',
  },
  {
    title: 'Океанские волны',
    description: 'Ровный прибой без резких пиков, помогает удерживать внимание на задаче.',
  },
  {
    title: 'Дождь с птицами',
    description: 'Утренний дождь с лёгкими перекличками птиц — спокойный ритм для глубокой работы.',
  },
  {
    title: 'Медитация',
    description: 'Спокойная музыка без слов — когда нужен мягкий якорь для концентрации.',
  },
  {
    title: 'Мягкая гроза',
    description: 'Далёкий дождь и тихий гром — маскирует отвлекающие звуки в общежитии или коворкинге.',
  },
] as const;

export default function FocusLandingPage() {
  return (
    <SeoLandingShell ctaLabel="Включить звуки">
      <header className="space-y-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-core-relax)]">
          Relax · Фокус
        </p>
        <h1 className="landing-hero-headline max-w-none text-left">Звуки для концентрации</h1>
        <p className="landing-hero-subhead max-w-2xl text-left">
          Режим Relax в Blunno — это библиотека фоновых звуков для учёбы и работы. Выберите
          атмосферу, настройте громкость и слушайте офлайн: звуки кэшируются в PWA и не отвлекают
          уведомлениями.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="landing-section-title text-left">Режим Relax для глубокого фокуса</h2>
        <p className="text-sm leading-relaxed text-white/65">
          Многим студентам, в том числе с ADHD, помогает стабильный аудио-фон: он снижает
          чувствительность к случайным шумам и создаёт «рабочий ритуал». В Relax можно включить один
          звук, отрегулировать громкость ползунком и продолжать слушать, переключаясь между
          разделами приложения — индикатор покажет, что воспроизведение активно.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Звуки в приложении</h2>
        <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
          {SOUNDS.map((sound) => (
            <li key={sound.title}>
              <SeoFeatureCard
                title={sound.title}
                description={sound.description}
                accent={RELAX_ACCENT}
              />
            </li>
          ))}
        </ul>
      </section>
    </SeoLandingShell>
  );
}
