import React from 'react';
import clsx from 'clsx';

interface AQIPProgressProps {
  value: number; // 0 à 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'warning' | 'danger';
  className?: string;
}

export default function AQIPProgress({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'primary',
  className
}: AQIPProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    primary: 'bg-aqip-primary',
    accent: 'bg-aqip-accent',
    warning: 'bg-aqip-warning',
    danger: 'bg-aqip-danger'
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-end mb-1">
          {label && <span className="text-sm font-medium text-aqip-text-primary">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-aqip-text-muted">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-aqip-bg-elevated rounded-full overflow-hidden', sizes[size])}>
        <div 
          className={clsx('rounded-full transition-all duration-500 ease-out', sizes[size], colors[color])} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
