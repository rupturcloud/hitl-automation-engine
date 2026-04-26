import React from 'react';
import { cn } from '../../types';

export const Badge = ({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'secondary' | 'outline' }) => {
  const variants = {
    default: 'bg-gold/20 text-gold border-gold/30',
    secondary: 'bg-white/5 text-white/60 border-white/10',
    outline: 'border border-white/20 text-white',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors uppercase tracking-widest',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
