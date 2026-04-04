'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** default: subtle panel; screen: Figma phone frame (25px radius + drop shadow); slot: planner teal gradient tile */
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'screen' | 'slot';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseClasses = 'transition-all duration-200';

    const variants: Record<NonNullable<CardProps['variant']>, string> = {
      default: 'rounded-3xl bg-white/5 border border-white/15',
      glass: 'rounded-3xl glass-card',
      elevated: 'rounded-3xl bg-white/10 shadow-2xl border border-white/20',
      outlined: 'rounded-3xl bg-transparent border-2 border-white/30',
      screen:
        'rounded-screen bg-blunno-bg border border-black shadow-screen overflow-hidden',
      slot: 'rounded-card border border-white bg-blunno-slot shadow-screen',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
      xl: 'p-8',
    };

    return (
      <div
        className={cn(baseClasses, variants[variant], paddings[padding], className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
