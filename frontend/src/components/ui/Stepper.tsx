import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Minus, Plus } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  error?: boolean;
  errorText?: string;
  helperText?: string;
  id?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  error,
  errorText,
  helperText,
  id,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: StepperProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const describedBy = [helperText, errorText].filter(Boolean).join(' ') ? `${inputId}-desc` : ariaDescribedBy;
  const reducedMotion = useReducedMotion();
  const [isFocused, setIsFocused] = React.useState(false);
  const [activeButton, setActiveButton] = React.useState<'decrement' | 'increment' | null>(null);

  // Motion values for button press animation
  const decrementScale = useMotionValue(1);
  const incrementScale = useMotionValue(1);
  const springDecrement = useSpring(decrementScale, { stiffness: 500, damping: 30 });
  const springIncrement = useSpring(incrementScale, { stiffness: 500, damping: 30 });

  const decrement = () => {
    if (disabled) return;
    const newVal = Math.max(min, value - step);
    onChange(newVal);
    if (!reducedMotion) {
      decrementScale.set(0.85);
      setTimeout(() => decrementScale.set(1), 100);
    }
  };

  const increment = () => {
    if (disabled) return;
    const newVal = Math.min(max, value + step);
    onChange(newVal);
    if (!reducedMotion) {
      incrementScale.set(0.85);
      setTimeout(() => incrementScale.set(1), 100);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = e.target.value === '' ? 0 : Number(e.target.value);
    if (Number.isNaN(val)) return;
    const clamped = Math.max(min, Math.min(max, val));
    onChange(clamped);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : Number(e.target.value);
    if (Number.isNaN(val)) {
      onChange(min);
    }
    setIsFocused(false);
  };

  const handleFocus = () => setIsFocused(true);

  const handleMouseDown = (btn: 'decrement' | 'increment') => {
    if (disabled) return;
    setActiveButton(btn);
  };

  const handleMouseUp = () => {
    setActiveButton(null);
  };

  const handleMouseLeaveButton = () => {
    if (activeButton === 'decrement') decrementScale.set(1);
    if (activeButton === 'increment') incrementScale.set(1);
    setActiveButton(null);
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-body-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-0 border rounded-lg bg-surface transition-all duration-fast ease-out-expo relative overflow-hidden"
        role="group"
        aria-label={ariaLabel || label}
      >
        {/* Focus glow */}
        {!reducedMotion && isFocused && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{ background: 'radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)' }}
          />
        )}
        <motion.button
          type="button"
          onClick={decrement}
          onMouseDown={() => handleMouseDown('decrement')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeaveButton}
          disabled={disabled || value <= min}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center text-text hover:bg-elevated transition-colors relative z-10',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'rounded-l-lg'
          )}
          aria-label="Decrease"
          aria-disabled={disabled || value <= min}
          style={{
            transform: reducedMotion ? undefined : { scale: springDecrement },
            transformOrigin: 'center',
          } as React.CSSProperties}
          whileHover={!reducedMotion && !disabled && value > min ? { scale: 1.05, backgroundColor: 'var(--color-elevated)' } : undefined}
        >
          <Minus className="h-6 w-6 transition-transform duration-fast flex-shrink-0" aria-hidden="true" />
        </motion.button>
        <input
          type="number"
          id={inputId}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'flex-1 w-0 min-w-[3.5rem] text-center text-body bg-transparent border-x border-border relative z-10',
            'focus:outline-none focus:ring-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'py-3',
            'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            error && 'text-danger',
            !error && 'text-text',
            isFocused && !error && 'text-accent'
          )}
          aria-invalid={error}
          aria-describedby={describedBy}
        />
        <motion.button
          type="button"
          onClick={increment}
          onMouseDown={() => handleMouseDown('increment')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeaveButton}
          disabled={disabled || value >= max}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center text-text hover:bg-elevated transition-colors relative z-10',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'rounded-r-lg'
          )}
          aria-label="Increase"
          aria-disabled={disabled || value >= max}
          style={{
            transform: reducedMotion ? undefined : { scale: springIncrement },
            transformOrigin: 'center',
          } as React.CSSProperties}
          whileHover={!reducedMotion && !disabled && value < max ? { scale: 1.05, backgroundColor: 'var(--color-elevated)' } : undefined}
        >
          <Plus className="h-6 w-6 transition-transform duration-fast flex-shrink-0" aria-hidden="true" />
        </motion.button>
      </div>
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
    </div>
  );
}