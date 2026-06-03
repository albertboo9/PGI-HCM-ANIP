import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface AQIPInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AQIPInput = forwardRef<HTMLInputElement, AQIPInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substr(2, 9);
    
    return (
      <div className={clsx('w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-aqip-text-primary mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-aqip-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              'block w-full rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 bg-aqip-bg-surface text-aqip-text-primary placeholder:text-aqip-text-muted',
              leftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              'py-2',
              error 
                ? 'border-aqip-danger focus:border-aqip-danger focus:ring-aqip-danger/20' 
                : 'border-aqip-border focus:border-aqip-primary focus:ring-aqip-primary/20 hover:border-aqip-text-muted/50',
              props.disabled && 'opacity-60 cursor-not-allowed bg-aqip-bg-elevated'
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-aqip-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={clsx('mt-1.5 text-xs', error ? 'text-aqip-danger' : 'text-aqip-text-muted')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

AQIPInput.displayName = 'AQIPInput';

export default AQIPInput;
