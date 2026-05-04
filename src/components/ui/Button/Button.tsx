'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Figma Home: SOS / PLANNER / PLAY / RELAX gradient tiles */
  variant?:
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'glass'
    | 'danger'
    | 'sos'
    | 'planner'
    | 'play'
    | 'relax';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'mode';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-sans font-extrabold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blunno-accent focus-visible:ring-offset-2 focus-visible:ring-offset-blunno-bg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-[color-mix(in_srgb,var(--color-core-planner)_32%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-core-planner)_42%,transparent)] text-white border border-[color-mix(in_srgb,var(--color-core-planner)_40%,transparent)] shadow-screen focus-visible:ring-blunno-accent',
      secondary:
        'bg-[color-mix(in_srgb,var(--color-core-play)_22%,var(--color-surface-2)_78%)] hover:bg-[color-mix(in_srgb,var(--color-core-play)_30%,var(--color-surface-2)_70%)] text-white border border-white/20 focus-visible:ring-blunno-accent-2',
      ghost:
        'bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/40',
      glass: 'glass-button text-white',
      danger:
        'bg-[color-mix(in_srgb,var(--color-core-sos)_55%,var(--color-core-bg)_45%)] hover:brightness-110 text-white focus-visible:ring-blunno-magenta border border-white/20',
      sos: 'btn-mode-sos',
      planner: 'btn-mode-planner',
      play: 'btn-mode-play',
      relax: 'btn-mode-relax text-[var(--foreground-soft)]',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5 min-h-11',
      md: 'px-4 py-2 text-base rounded-xl gap-2 min-h-11',
      lg: 'px-6 py-3 text-lg rounded-2xl gap-2.5 min-h-12',
      xl: 'px-8 py-4 text-xl rounded-3xl gap-3 min-h-14',
      mode: 'min-h-[80px] w-full max-w-[350px] px-6 text-xl rounded-card tracking-figma uppercase shadow-screen',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          isLoading && 'cursor-wait',
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
