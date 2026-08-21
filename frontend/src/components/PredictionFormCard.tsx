import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { type ToastOptions } from '../hooks/useToast';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface PredictionFormCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: ToastOptions | null;
  onDismissError?: () => void;
}

export function PredictionFormCard({
  children,
  title = 'Predict Your Property Price',
  description = 'Enter property details to get an instant price estimate',
  loading = false,
  error,
  onDismissError,
}: PredictionFormCardProps) {
  const reducedMotion = useReducedMotion();

  // Scroll-triggered entrance animation
  const { ref: cardRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -15% 0px',
    triggerOnce: true,
  });

  return (
    <section aria-labelledby="form-title" className="w-full max-w-2xl mx-auto" ref={cardRef}>
      <motion.div
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        animate={isVisible && !reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative rounded-2xl border border-border bg-surface shadow-lg p-6 sm:p-8 lg:p-10">
        <header className="mb-8">
          <h2 id="form-title" className="font-display text-heading-md font-semibold text-text">
            {title}
          </h2>
          <p className="mt-2 text-body text-muted">{description}</p>
        </header>

        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-lg border-l-4 border-danger bg-danger/10 p-4 animate-enter"
            role="alert"
          >
            <span className="mt-0.5 shrink-0 text-danger" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm text-text">{error.message}</p>
              {error.action && (
                <button
                  type="button"
                  onClick={error.action.onClick}
                  className="mt-2 text-body-sm font-medium text-accent hover:underline"
                >
                  {error.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onDismissError}
              aria-label="Dismiss error"
              className="shrink-0 text-subtle hover:text-text transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm z-10"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-border border-t-accent" aria-hidden="true" />
              <span className="text-body text-muted">Predicting...</span>
            </div>
          </div>
        )}

        <div className={cn('relative', loading ? 'pointer-events-none opacity-50' : '')}>
          {children}
        </div>
      </div>
    </motion.div>
    </section>
  );
}