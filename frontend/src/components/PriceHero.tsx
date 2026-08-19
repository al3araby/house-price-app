import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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

  const formatted = formatIndianCurrency(price);
  const screenReaderText = formatPriceForScreenReader(price);

  const count = useMotionValue(0);
  const displayCount = useSpring(count, { stiffness: 100, damping: 20 });

  // Transform the animated count to a formatted string with 2 decimal places
  const displayValue = useTransform(displayCount, (latest) => latest.toFixed(2));

  React.useEffect(() => {
    if (shouldAnimate) {
      count.set(0);
      const duration = 800;
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        count.set(eased * formatted.rawLac);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      count.set(formatted.rawLac);
    }
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
        </div>

        {/* Screen reader only announcement */}
        <span className="sr-only" aria-live="polite">
          Predicted price: {screenReaderText}
        </span>
      </motion.div>
    </header>
  );
}