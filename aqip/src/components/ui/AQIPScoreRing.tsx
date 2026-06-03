import React from 'react';
import clsx from 'clsx';

interface AQIPScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
  colorScale?: boolean;
}

export default function AQIPScoreRing({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 8,
  label,
  className,
  colorScale = true
}: AQIPScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.max(0, Math.min(100, (score / maxScore) * 100));
  const offset = circumference - (percent / 100) * circumference;

  let colorClass = 'text-aqip-primary';
  if (colorScale) {
    if (percent >= 80) colorClass = 'text-aqip-accent';
    else if (percent >= 50) colorClass = 'text-aqip-warning';
    else colorClass = 'text-aqip-danger';
  }

  return (
    <div className={clsx('relative inline-flex flex-col items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          className="text-aqip-bg-elevated"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={clsx('transition-all duration-1000 ease-out', colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-aqip-text-primary">
          {score}
        </span>
        {label && <span className="text-xs text-aqip-text-muted mt-1 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
}
