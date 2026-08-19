import * as React from 'react';
import { ToastContext, useToastProvider, type Toast } from '../../hooks/useToast';
import { ToastViewport } from './Toast';

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, addToast, removeToast, clearToasts } = useToastProvider();

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast: Toast) => {
      if (!toast.duration) return null;
      return setTimeout(() => removeToast(toast.id), toast.duration);
    });
    return () => {
      timers.forEach((t) => t && clearTimeout(t));
    };
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
