import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Toast as ToastType } from '../../hooks/useToast';

interface ToastViewportProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

const variantStyles: Record<string, { icon: React.ReactNode; border: string; iconColor: string }> = {
  error: {
    icon: <AlertCircle className="h-5 w-5" aria-hidden="true" />,
    border: 'border-l-danger',
    iconColor: 'text-danger',
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
    border: 'border-l-success',
    iconColor: 'text-success',
  },
  info: {
    icon: <Info className="h-5 w-5" aria-hidden="true" />,
    border: 'border-l-info',
    iconColor: 'text-info',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
    border: 'border-l-warning',
    iconColor: 'text-warning',
  },
};

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="fixed bottom-0 right-0 z-[70] flex w-full max-w-[400px] flex-col gap-3 p-4 sm:bottom-4 sm:right-4 sm:p-0"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const v = variantStyles[toast.variant] || variantStyles.info;
          const isError = toast.variant === 'error';
          return (
            <motion.div
              key={toast.id}
              layout={!reducedMotion}
              initial={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8, x: 100 }}
              animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0, scale: 0.8 } : { opacity: 0, scale: 0.8, x: 100 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 35,
                mass: 0.8,
              }}
              role={isError ? 'alert' : 'status'}
              aria-live={isError ? 'assertive' : 'polite'}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-elevated p-4 shadow-lg',
                v.border
              )}
            >
              <span className={cn('mt-0.5 shrink-0', v.iconColor)}>{v.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-text break-words">{toast.message}</p>
                {toast.action && (
                  <button
                    type="button"
                    onClick={toast.action.onClick}
                    className="mt-2 text-body-sm font-medium text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 text-subtle hover:text-text transition-colors rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
