'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Headphones, Sparkles, WifiOff, Wind, type LucideIcon } from 'lucide-react';
import type { ReactElement } from 'react';

import { GlassListCell } from '@/components/shared/make-v81/GlassListCell';

type Feature = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentColor: string;
};

const FEATURES: Feature[] = [
  {
    title: 'SOS breathing',
    subtitle: '3-minute reset for exam panic',
    icon: Wind,
    accentColor: '#E07A5F',
  },
  {
    title: 'Focus sounds',
    subtitle: 'Study ambience that works offline',
    icon: Headphones,
    accentColor: '#D4A373',
  },
  {
    title: 'Offline mode',
    subtitle: 'Install once — works without internet',
    icon: WifiOff,
    accentColor: '#7BA89A',
  },
  {
    title: 'Free forever',
    subtitle: 'No signup, no paywall',
    icon: Sparkles,
    accentColor: '#9D84B7',
  },
];

export function LandingFeatures(): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <section className="landing-section" aria-labelledby="landing-features-title">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <h2 id="landing-features-title" className="landing-section-title">
          Built for study stress
        </h2>
        <p className="landing-section-lead">Everything you need for a quick reset between sessions.</p>

        <div className="landing-features-grid v81-glass-cell-list mt-6">
          {FEATURES.map((feature, index) => (
            <GlassListCell
              key={feature.title}
              as="div"
              accentColor={feature.accentColor}
              title={feature.title}
              subtitle={feature.subtitle}
              subtitleVariant="description"
              icon={feature.icon}
              titleAs="h3"
              animationDelay={`${0.05 + index * 0.06}s`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
