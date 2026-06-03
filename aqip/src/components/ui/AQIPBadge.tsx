import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface AQIPBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export default function AQIPBadge({ variant = 'default', children, className, ...props }: AQIPBadgeProps) {
  const variants = {
    success: 'bg-aqip-accent/10 text-aqip-accent border border-aqip-accent/20',
    warning: 'bg-aqip-warning/10 text-aqip-warning border border-aqip-warning/20',
    danger: 'bg-aqip-danger/10 text-aqip-danger border border-aqip-danger/20',
    info: 'bg-aqip-primary/10 text-aqip-primary border border-aqip-primary/20',
    default: 'bg-aqip-bg-elevated text-aqip-text-muted border border-aqip-border',
  };

  return (
    <span 
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
