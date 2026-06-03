import React, { ButtonHTMLAttributes } from 'react';
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-aqip-bg-base';
  
  const variants = {
    primary: 'bg-aqip-primary text-white hover:bg-aqip-primary-dark focus:ring-aqip-primary shadow-sm',
    secondary: 'bg-aqip-bg-elevated text-aqip-text-primary border border-aqip-border hover:bg-aqip-border focus:ring-aqip-text-muted',
    danger: 'bg-aqip-danger text-white hover:bg-red-700 focus:ring-aqip-danger shadow-sm',
    ghost: 'bg-transparent text-aqip-text-muted hover:text-aqip-text-primary hover:bg-aqip-bg-elevated focus:ring-aqip-text-muted',
    outline: 'bg-transparent text-aqip-primary border border-aqip-primary hover:bg-aqip-primary/10 focus:ring-aqip-primary'
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
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
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
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
