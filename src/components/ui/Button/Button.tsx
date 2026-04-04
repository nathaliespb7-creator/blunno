'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
      'inline-flex items-center justify-center font-sans font-extrabold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blunno-blue focus-visible:ring-offset-2 focus-visible:ring-offset-blunno-bg disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-blunno-blue hover:brightness-110 text-white focus-visible:ring-blunno-blue shadow-screen',
      secondary:
        'bg-secondary-600 hover:bg-secondary-700 text-white focus-visible:ring-secondary-500',
      ghost:
        'bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/40',
      glass: 'glass-button text-white',
      danger: 'bg-blunno-coral hover:brightness-110 text-white focus-visible:ring-blunno-coral',
      sos: 'bg-blunno-sos text-white border border-white shadow-screen [box-shadow:inset_0_4px_50px_rgba(0,0,0,0.25)]',
      planner:
        'bg-blunno-planner text-white border border-white shadow-screen [box-shadow:inset_0_4px_200px_rgba(0,0,0,0.25)]',
      play: 'bg-blunno-play text-white border border-white shadow-screen [box-shadow:inset_0_4px_50px_rgba(0,0,0,0.25)]',
      relax:
        'bg-blunno-relax text-[#fffbfb] border border-white shadow-screen [box-shadow:inset_0_4px_50px_rgba(0,0,0,0.25)]',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2 text-base rounded-xl gap-2',
      lg: 'px-6 py-3 text-lg rounded-2xl gap-2.5',
      xl: 'px-8 py-4 text-xl rounded-3xl gap-3',
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
