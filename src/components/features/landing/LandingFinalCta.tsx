'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactElement } from 'react';

import { WelcomeCTA } from '@/components/features/welcome/WelcomeCTA';

export function LandingFinalCta(): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <section className="landing-section landing-final-cta" aria-labelledby="landing-final-cta-title">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
        className="landing-final-cta-panel flex flex-col items-center text-center"
      >
        <h2 id="landing-final-cta-title" className="landing-section-title">
          Ready for your next study reset?
        </h2>
        <p className="landing-section-lead mt-2 max-w-md">
          Pick SOS, planner, games, or focus sounds — all in one free app.
        </p>
        <WelcomeCTA href="/choose" label="Open Blunno" className="mt-8 max-w-sm" />
      </motion.div>
    </section>
  );
}
