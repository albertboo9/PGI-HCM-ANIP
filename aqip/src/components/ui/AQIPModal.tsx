import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface AQIPModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export default function AQIPModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}: AQIPModalProps) {
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] h-[95vh]'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={clsx(
        'relative w-full rounded-xl bg-aqip-bg-surface shadow-2xl border border-aqip-border transform transition-all',
        sizes[size],
        size === 'full' && 'flex flex-col'
      )}>
        <div className="flex items-center justify-between border-b border-aqip-border px-6 py-4">
          <h3 className="text-lg font-semibold text-aqip-text-primary">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-aqip-text-muted hover:bg-aqip-bg-elevated hover:text-aqip-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-aqip-primary"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer</span>
          </button>
        </div>
        
        <div className={clsx('p-6', size === 'full' && 'flex-1 overflow-y-auto')}>
          {children}
        </div>

        {footer && (
          <div className="border-t border-aqip-border bg-aqip-bg-elevated/50 px-6 py-4 flex items-center justify-end gap-3 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
