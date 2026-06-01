'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Plus, Share, Smartphone } from 'lucide-react';
import type { ReactElement } from 'react';

const STEPS = [
  {
    icon: Share,
    title: 'Tap Share',
    description: 'Open the browser menu and tap Share (Safari) or the share icon.',
  },
  {
    icon: Plus,
    title: 'Add to Home Screen',
    description: 'Choose Add to Home Screen and confirm the install.',
  },
  {
    icon: Smartphone,
    title: 'Open offline',
    description: 'Launch Blunno from your home screen — it works without internet.',
  },
] as const;

export function LandingPwaInstall(): ReactElement {
  const reduceMotion = useReducedMotion();

  return (
    <section className="landing-section" aria-labelledby="landing-pwa-title">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
      >
        <h2 id="landing-pwa-title" className="landing-section-title">
          Install Blunno on your phone
        </h2>
        <p className="landing-section-lead">Add the PWA once — open it anytime, even offline.</p>

        <ol className="landing-pwa-steps mt-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="landing-pwa-step">
                <div className="landing-pwa-step-icon" aria-hidden>
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="landing-pwa-step-title">
                    <span className="landing-pwa-step-num">{index + 1}.</span> {step.title}
                  </p>
                  <p className="landing-pwa-step-desc">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="landing-pwa-note mt-4 text-balance">
          On Android, tap Install app or Add to Home Screen in your browser menu.
        </p>
      </motion.div>
    </section>
  );
}
