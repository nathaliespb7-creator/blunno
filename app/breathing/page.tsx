import type { Metadata } from 'next';

import { SeoLandingShell, SeoStep } from '@/components/features/seo/SeoLandingShell';
import { routeMetadata } from '@/lib/seo';

export const dynamic = 'force-static';

export const metadata: Metadata = routeMetadata({
  path: '/breathing',
  title: 'Дыхательные упражнения от стресса',
  absoluteTitle: 'Дыхательные упражнения от стресса и паники – Blunno',
  description:
    'Бесплатные дыхательные упражнения чтобы успокоиться перед экзаменом. Техника SOS-дыхания, офлайн, без регистрации.',
});

const SOS_ACCENT = '#905e8c';

export default function BreathingLandingPage() {
  return (
    <SeoLandingShell ctaLabel="Попробовать бесплатно">
      <header className="space-y-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-core-planner)]">
          SOS · Дыхание
        </p>
        <h1 className="landing-hero-headline max-w-none text-left">
          Дыхательные упражнения от стресса
        </h1>
        <p className="landing-hero-subhead max-w-2xl text-left">
          Blunno помогает быстро успокоиться перед экзаменом или сложной задачей. Режим SOS
          проводит через проверенную технику 3-2-3 — вдох, пауза, выдох — с визуальным кольцом и
          мягкой обратной связью.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="landing-section-title text-left">Как работает SOS-режим</h2>
        <p className="text-sm leading-relaxed text-white/65">
          Кольцо на экране расширяется на вдохе и сжимается на выдохе. Вы можете следовать
          автоматическому Guided-режиму или вести палец по кольцу в Trace-режиме — оба варианты
          синхронизированы с ритмом 3-2-3. Три полных цикла занимают около минуты и не требуют
          регистрации или интернета.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Три шага к спокойствию</h2>
        <ol className="flex list-none flex-col gap-3 p-0">
          <SeoStep
            step={1}
            accent={SOS_ACCENT}
            title="Откройте SOS в Blunno"
            description="Запустите приложение, нажмите Start Now и выберите плитку SOS — или перейдите сразу в режим дыхания."
          />
          <SeoStep
            step={2}
            accent={SOS_ACCENT}
            title="Дышите по кольцу 3-2-3"
            description="Вдох 3 секунды, пауза 2, выдох 3. Следуйте анимации кольца — оно задаёт темп, вам остаётся только дышать."
          />
          <SeoStep
            step={3}
            accent={SOS_ACCENT}
            title="Завершите 3 цикла"
            description="После каждого цикла — короткая поддержка от Blunno. Когда паника отступает, возвращайтесь к учёбе с ясной головой."
          />
        </ol>
      </section>
    </SeoLandingShell>
  );
}
