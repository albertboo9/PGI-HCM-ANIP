import React from 'react';
import clsx from 'clsx';

interface AQIPCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function AQIPCard({ children, className, noPadding = false, ...props }: AQIPCardProps) {
  return (
    <div 
      className={clsx(
        "bg-aqip-bg-surface border border-aqip-border rounded-xl shadow-sm overflow-hidden",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
