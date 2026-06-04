import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface AQIPButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function AQIPButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}: AQIPButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--aqip-bg-base)] active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-[var(--aqip-primary)] text-[var(--aqip-text-inverted)] hover:bg-[var(--aqip-primary-dark)] focus:ring-[var(--aqip-primary)] shadow-[var(--aqip-shadow-sm)] hover:shadow-[var(--aqip-shadow-md)] border border-transparent',
    secondary: 'bg-[var(--aqip-bg-elevated)] text-[var(--aqip-text-primary)] border border-[var(--aqip-border)] hover:bg-[var(--aqip-border)] focus:ring-[var(--aqip-text-muted)] shadow-[var(--aqip-shadow-sm)]',
    danger: 'bg-[var(--aqip-danger)] text-white hover:bg-[var(--aqip-danger-light)] hover:text-[var(--aqip-danger)] border border-transparent hover:border-[var(--aqip-danger)] focus:ring-[var(--aqip-danger)] shadow-[var(--aqip-shadow-sm)]',
    ghost: 'bg-transparent text-[var(--aqip-text-muted)] hover:text-[var(--aqip-text-primary)] hover:bg-[var(--aqip-bg-elevated)] focus:ring-[var(--aqip-text-muted)]',
    outline: 'bg-transparent text-[var(--aqip-primary)] border border-[var(--aqip-primary)] hover:bg-[var(--aqip-primary-light)] focus:ring-[var(--aqip-primary)]'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5'
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed transform-none hover:shadow-none',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
