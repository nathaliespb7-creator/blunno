'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      error,
      label,
      id,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full bg-transparent border transition-all duration-200 text-blunno-foreground placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blunno-blue/50 focus:border-blunno-blue disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'border-white/20 focus:border-blunno-blue',
      glass: 'border-white/30 bg-white/5 backdrop-blur-sm focus:border-blunno-blue',
      outlined: 'border-white/40 focus:border-blunno-blue',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-lg font-ui',
      md: 'px-4 py-3 text-base rounded-card font-body',
      lg: 'px-5 py-4 text-lg rounded-2xl font-body',
    };

    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-semibold tracking-wide text-white/85"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">{leftIcon}</div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseClasses,
              variants[variant],
              sizes[inputSize],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-blunno-coral focus:border-blunno-coral focus:ring-blunno-coral/40',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">{rightIcon}</div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-blunno-coral">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
