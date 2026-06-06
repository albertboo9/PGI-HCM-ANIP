import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import clsx from 'clsx';

type ToastType = 'coach' | 'success' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  action?: { label: string; to: string };
}

interface ToasterContextType {
  push: (type: ToastType, message: string, action?: { label: string; to: string }) => void;
}

const ToasterContext = createContext<ToasterContextType>({ push: () => {} });

export function useToaster() {
  return useContext(ToasterContext);
}

const ICONS: Record<ToastType, typeof Sparkles> = {
  coach: Sparkles,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const COLORS: Record<ToastType, string> = {
  coach: 'border-[var(--aqip-primary)] bg-gradient-to-r from-[var(--aqip-primary)]/10 to-[var(--aqip-bg-surface)]',
  success: 'border-[var(--aqip-accent)] bg-gradient-to-r from-[var(--aqip-accent)]/10 to-[var(--aqip-bg-surface)]',
  warning: 'border-[var(--aqip-warning)] bg-gradient-to-r from-[var(--aqip-warning)]/10 to-[var(--aqip-bg-surface)]',
  info: 'border-[var(--aqip-border)] bg-[var(--aqip-bg-surface)]',
};

const DOT_COLORS: Record<ToastType, string> = {
  coach: 'bg-[var(--aqip-primary)]',
  success: 'bg-[var(--aqip-accent)]',
  warning: 'bg-[var(--aqip-warning)]',
  info: 'bg-[var(--aqip-text-muted)]',
};

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, message: string, action?: { label: string; to: string }) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, message, action }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToasterContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = ICONS[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className={clsx("pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md relative overflow-hidden", COLORS[toast.type])}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${DOT_COLORS[toast.type]}`}></div>
                <div className={`p-2 rounded-full shrink-0 ${DOT_COLORS[toast.type]} bg-opacity-10`}>
                  <Icon className={`h-4 w-4 ${toast.type === 'coach' ? 'text-[var(--aqip-primary)]' : toast.type === 'success' ? 'text-[var(--aqip-accent)]' : toast.type === 'warning' ? 'text-[var(--aqip-warning)]' : 'text-[var(--aqip-text-muted)]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--aqip-text-primary)] leading-relaxed">{toast.message}</p>
                  {toast.action && (
                    <a href={toast.action.to} className="inline-block mt-2 text-[10px] font-bold text-[var(--aqip-primary)] hover:underline">
                      {toast.action.label} →
                    </a>
                  )}
                </div>
                <button onClick={() => dismiss(toast.id)} className="shrink-0 text-[var(--aqip-text-muted)] hover:text-[var(--aqip-text-primary)]">
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToasterContext.Provider>
  );
}