'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactElement } from 'react';

import { WelcomeCTA } from '@/components/features/welcome/WelcomeCTA';
import { WelcomeMascot } from '@/components/features/welcome/WelcomeMascot';

export function LandingHero(): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <section className="landing-section landing-hero" aria-labelledby="landing-hero-title">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
        className="flex flex-col items-center text-center"
      >
        <WelcomeMascot className="landing-hero-mascot" />

        <p className="welcome-title landing-hero-brand mt-2">Blunno</p>

        <h1 id="landing-hero-title" className="landing-hero-headline mt-3">
          Your pocket reset for study stress
        </h1>

        <p className="landing-hero-subhead mt-3 max-w-md text-balance">
          Free offline PWA for students — SOS breathing, focus sounds, and mini breaks. No signup.
        </p>

        <WelcomeCTA href="/relax" label="Try Blunno" className="landing-hero-cta mt-8 max-w-sm" />
      </motion.div>
    </section>
  );
}
