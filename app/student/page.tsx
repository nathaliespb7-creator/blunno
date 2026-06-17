import type { Metadata } from 'next';

import { SeoFeatureCard, SeoLandingShell } from '@/components/features/seo/SeoLandingShell';
import { routeMetadata } from '@/lib/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = routeMetadata({
  path: '/student',
  title: 'Mindfulness для студентов',
  absoluteTitle: 'Mindfulness для студентов – Blunno',
  description:
    'Mindfulness-инструменты для студентов: дыхание, дневник, мини-игры. Снижение стресса перед экзаменами. Бесплатно и офлайн.',
});

const MODES = [
  {
    title: 'SOS — дыхание при панике',
    description:
      'Быстрый сброс перед экзаменом: техника 3-2-3 с визуальным кольцом. Три цикла — и вы снова в ресурсе.',
    accent: '#905e8c',
  },
  {
    title: 'Planner — осознанный день',
    description:
      'Недельный планировщик с задачами на день: выгрузите дела из головы, отметьте выполненное и сфокусируйтесь на одном шаге.',
    accent: '#83a9ad',
  },
  {
    title: 'Relax — звуки для фокуса',
    description:
      'Фоновые звуки природы и медитации для концентрации. Работает офлайн, с регулировкой громкости под вашу среду.',
    accent: '#e7b453',
  },
] as const;

export default function StudentLandingPage() {
  return (
    <SeoLandingShell ctaLabel="Начать практику">
      <header className="space-y-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-core-planner)]">
          Для студентов
        </p>
        <h1 className="landing-hero-headline max-w-none text-left">Mindfulness для студентов</h1>
        <p className="landing-hero-subhead max-w-2xl text-left">
          Blunno — бесплатный карманный набор для учебного стресса: успокоиться, спланировать день и
          удержать фокус. Всё работает офлайн, без аккаунта и подписок — установите PWA и открывайте
          за секунду.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="landing-section-title text-left">Три опоры учебного дня</h2>
        <p className="text-sm leading-relaxed text-white/65">
          Вместо десятка разрозненных приложений — одна связка: SOS снимает острую панику, Planner
          структурирует нагрузку, Relax поддерживает концентрацию во время сессии. Между ними можно
          переключаться с экрана Choose за один тап.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">SOS + Planner + Relax</h2>
        <ul className="flex list-none flex-col gap-3 p-0">
          {MODES.map((mode) => (
            <li key={mode.title}>
              <SeoFeatureCard
                title={mode.title}
                description={mode.description}
                accent={mode.accent}
              />
            </li>
          ))}
        </ul>
      </section>
    </SeoLandingShell>
  );
}
