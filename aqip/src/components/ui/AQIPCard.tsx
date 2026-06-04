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
        "bg-[var(--aqip-bg-surface)] border border-[var(--aqip-border)] rounded-xl shadow-[var(--aqip-shadow-sm)] hover:shadow-[var(--aqip-shadow-md)] overflow-hidden transition-all duration-300",
        !noPadding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
