import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

interface AQIPDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'md' | 'lg' | 'xl';
}

export default function AQIPDrawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md'
}: AQIPDrawerProps) {
  
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-2xl'
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={clsx(
          'relative flex h-full flex-col bg-aqip-bg-surface shadow-2xl border-x border-aqip-border transition-transform',
          sizes[size],
          position === 'right' ? 'ml-auto' : 'mr-auto',
          'animate-in slide-in-from-right duration-300'
        )}
      >
        <div className="flex items-center justify-between border-b border-aqip-border px-6 py-4 bg-aqip-bg-elevated/30">
          <h2 className="text-lg font-semibold text-aqip-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-aqip-text-muted hover:bg-aqip-bg-elevated hover:text-aqip-text-primary transition-colors focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
