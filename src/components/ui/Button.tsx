import React from 'react';
import { cn } from '../../types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-gold text-black hover:bg-gold/90 font-bold',
      outline: 'border border-white/20 bg-transparent hover:bg-white/5 text-white',
      secondary: 'bg-white/10 text-white hover:bg-white/20',
      ghost: 'bg-transparent hover:bg-white/5 text-white',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3 text-base',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
