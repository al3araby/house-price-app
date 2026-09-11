import * as React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate as animateValue } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatIndianCurrency, formatPriceForScreenReader } from '../lib/formatters';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PriceHeroProps {
  price: number;
  location?: string;
  animate?: boolean;
}

export function PriceHero({ price, location, animate = true }: PriceHeroProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;
  // Without animation the count is final immediately, so treat it as complete.
  const [countComplete, setCountComplete] = React.useState(() => !shouldAnimate);

  const formatted = formatIndianCurrency(price);
  const screenReaderText = formatPriceForScreenReader(price);

  const count = useMotionValue(0);
  const displayCount = useSpring(count, { stiffness: 100, damping: 20 });

  // Transform the animated count to a formatted string with 2 decimal places
  const displayValue = useTransform(displayCount, (latest) => latest.toFixed(2));

  React.useEffect(() => {
    if (shouldAnimate) {
      // Animate the count on the motion value; onComplete is async so no
      // synchronous setState in the effect, and the spring stays interruptible.
      count.set(0);
      const controls = animateValue(count, formatted.rawLac, {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => setCountComplete(true),
      });
      return () => controls.stop();
    }
    count.set(formatted.rawLac);
    // Non-animated path: state was already initialised to !shouldAnimate === true
    // on mount, so no setState needed here.
  }, [price, shouldAnimate, count, formatted.rawLac]);

  return (
    <header className="relative text-center py-12 sm:py-16 lg:py-20">
      <motion.div
        initial={shouldAnimate ? { opacity: 0, scale: 0.96 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        role="heading"
        aria-level={1}
        aria-live="polite"
        className="group"
      >
        {/* One-shot success cue when the count-up lands */}
        {shouldAnimate && countComplete && (
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
            initial={{ scale: 0.7, opacity: 1 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            <div className="h-64 w-64 rounded-full border-2 border-accent/40" />
          </motion.div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-baseline gap-3">
            <motion.span
              style={{ color: 'var(--color-accent)' }}
              className={cn(
                'font-display text-display-2xl font-bold tabular-nums',
                'sm:text-display-xl lg:text-display-2xl'
              )}
            >
              {displayValue}
            </motion.span>
            <span className="font-display text-heading-lg font-semibold text-accent/90">
              Cr
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <span className="font-utility text-body-lg text-text" aria-hidden="true">
              ({formatted.lac})
            </span>
            {location && (
              <>
                <span className="w-px h-6 bg-border" aria-hidden="true" />
                <span className="text-body-sm capitalize">{location}</span>
              </>
            )}
          </div>

          {/* Success chip — springs in once the count-up lands */}
          <AnimatePresence>
            {shouldAnimate && countComplete && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                <span className="text-body-sm font-medium text-success">Price estimated</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Screen reader only announcement */}
        <span className="sr-only" aria-live="polite">
          Predicted price: {screenReaderText}
        </span>
      </motion.div>
    </header>
  );
}