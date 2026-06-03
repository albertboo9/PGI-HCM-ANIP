import React from 'react';
import AQIPCard from './AQIPCard';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AQIPStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  className?: string;
  color?: 'primary' | 'accent' | 'warning' | 'danger';
}

export default function AQIPStatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
  color = 'primary'
}: AQIPStatCardProps) {
  
  const colors = {
    primary: 'text-aqip-primary bg-aqip-primary/10 border-aqip-primary/20',
    accent: 'text-aqip-accent bg-aqip-accent/10 border-aqip-accent/20',
    warning: 'text-aqip-warning bg-aqip-warning/10 border-aqip-warning/20',
    danger: 'text-aqip-danger bg-aqip-danger/10 border-aqip-danger/20'
  };

  return (
    <AQIPCard className={clsx('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-aqip-text-muted">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-aqip-text-primary">{value}</p>
        </div>
        <div className={clsx('p-2.5 rounded-xl border', colors[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="mt-4 flex items-center text-sm">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-aqip-accent mr-1" />
          ) : trend < 0 ? (
            <TrendingDown className="h-4 w-4 text-aqip-danger mr-1" />
          ) : (
            <Minus className="h-4 w-4 text-aqip-text-muted mr-1" />
          )}
          <span className={clsx(
            'font-medium mr-2',
            trend > 0 ? 'text-aqip-accent' : trend < 0 ? 'text-aqip-danger' : 'text-aqip-text-muted'
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-aqip-text-muted text-xs">{trendLabel}</span>}
        </div>
      )}
    </AQIPCard>
  );
}
