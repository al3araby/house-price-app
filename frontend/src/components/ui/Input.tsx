import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, errorText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const describedBy = [helperText, errorText].filter(Boolean).join(' ') ? `${inputId}-desc` : undefined;
    const reducedMotion = useReducedMotion();
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    // Motion values for animated label
    const labelY = useMotionValue(0);
    const labelScale = useMotionValue(1);
    const labelOpacity = useMotionValue(0);
    const springLabelY = useSpring(labelY, { stiffness: 300, damping: 25 });
    const springLabelScale = useSpring(labelScale, { stiffness: 300, damping: 25 });
    const springLabelOpacity = useSpring(labelOpacity, { stiffness: 300, damping: 25 });

    // Focus glow intensity
    const glowIntensity = useMotionValue(0);
    const springGlow = useSpring(glowIntensity, { stiffness: 400, damping: 30 });

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      setHasValue(true);
      if (!reducedMotion) {
        labelY.set(-24);
        labelScale.set(0.85);
        labelOpacity.set(1);
        glowIntensity.set(1);
      }
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (e.target.value === '') {
        setHasValue(false);
      }
      if (!reducedMotion) {
        if (e.target.value === '') {
          labelY.set(0);
          labelScale.set(1);
          labelOpacity.set(0);
        }
        glowIntensity.set(0);
      }
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value && !hasValue) {
        setHasValue(true);
        if (!reducedMotion && !isFocused) {
          labelY.set(-24);
          labelScale.set(0.85);
          labelOpacity.set(1);
        }
      } else if (!e.target.value && hasValue && !isFocused) {
        setHasValue(false);
        if (!reducedMotion) {
          labelY.set(0);
          labelScale.set(1);
          labelOpacity.set(0);
        }
      }
      props.onChange?.(e);
    };

    // Transform for label animation - use string template for CSS compatibility
    const labelTransform = reducedMotion ? {} : {
      transform: `translateY(${springLabelY.get()}px) scale(${springLabelScale.get()})`,
      opacity: springLabelOpacity.get(),
      transformOrigin: 'left top',
    } as React.CSSProperties;

    // Glow effect - use motion value directly
    const glowSpread = useTransform(springGlow, [0, 1], [0, 20]);
    const glowBlur = useTransform(springGlow, [0, 1], [0, 4]);
    const glowOpacity = useTransform(springGlow, [0, 1], ['00', '40']);
    const glowStyle = reducedMotion ? {} : {
      boxShadow: `0 0 ${glowSpread.get()}px ${glowBlur.get()}px ${error ? 'var(--color-danger)' : 'var(--color-accent)'}${glowOpacity.get()}`,
    } as React.CSSProperties;

    return (
      <div className="w-full relative">
        {label && (
          <motion.label
            htmlFor={inputId}
            className="absolute left-4 top-3.5 text-body-sm font-medium text-muted pointer-events-none transition-colors duration-fast ease-out-expo z-10"
            style={labelTransform}
            initial={false}
            animate={{ opacity: hasValue || isFocused ? 1 : 0 }}
          >
            {label}
            {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
          </motion.label>
        )}
        <div
          className="relative"
          style={glowStyle}
        >
          <input
            type={type}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-lg bg-surface border transition-all duration-fast ease-out-expo',
              'text-text placeholder:text-subtle',
              'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-danger focus:ring-danger focus:border-danger',
              !error && 'border-border hover:border-subtle',
              isFocused && !error && 'ring-2 ring-accent/30',
              hasValue && 'pt-5 pb-2', // Make room for floating label
              className
            )}
            ref={ref}
            aria-invalid={error}
            aria-describedby={describedBy}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {/* Animated focus border */}
          {!reducedMotion && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                borderColor: error ? 'var(--color-danger)' : 'var(--color-accent)',
                borderWidth: 2,
                borderStyle: 'solid',
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: isFocused || hasValue ? 1 : 0, opacity: isFocused ? 1 : (hasValue ? 0.5 : 0) }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </div>
        {(helperText || errorText) && (
          <motion.p
            id={`${inputId}-desc`}
            className="mt-1.5 text-body-sm"
            role={errorText ? 'alert' : undefined}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {errorText ? (
              <span className="text-danger">{errorText}</span>
            ) : (
              <span className="text-muted">{helperText}</span>
            )}
          </motion.p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };