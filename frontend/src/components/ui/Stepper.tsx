import * as React from 'react';
import { cn } from '../../lib/utils';
import { Minus, Plus } from 'lucide-react';

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

  const decrement = () => {
    if (disabled) return;
    const newVal = Math.max(min, value - step);
    onChange(newVal);
  };

  const increment = () => {
    if (disabled) return;
    const newVal = Math.min(max, value + step);
    onChange(newVal);
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
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-body-sm font-medium text-text mb-2">
          {label}
        </label>
      )}
      <div className="flex items-center gap-0 border rounded-lg bg-surface transition-all duration-fast ease-out-expo" role="group" aria-label={ariaLabel || label}>
        <button
          type="button"
          onClick={decrement}
          disabled={disabled || value <= min}
          className={cn(
            'flex h-11 w-11 items-center justify-center text-text hover:bg-elevated transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'rounded-l-lg'
          )}
          aria-label="Decrease"
          aria-disabled={disabled || value <= min}
        >
          <Minus className="h-5 w-5" aria-hidden="true" />
        </button>
        <input
          type="number"
          id={inputId}
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cn(
            'flex-1 w-0 text-center text-body bg-transparent border-x border-border',
            'focus:outline-none focus:ring-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'py-3',
            'appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
            error && 'text-danger',
            !error && 'text-text'
          )}
          aria-invalid={error}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled || value >= max}
          className={cn(
            'flex h-11 w-11 items-center justify-center text-text hover:bg-elevated transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'rounded-r-lg'
          )}
          aria-label="Increase"
          aria-disabled={disabled || value >= max}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {(helperText || errorText) && (
        <p id={`${inputId}-desc`} className="mt-1.5 text-body-sm" role={errorText ? 'alert' : undefined}>
          {errorText ? (
            <span className="text-danger">{errorText}</span>
          ) : (
            <span className="text-muted">{helperText}</span>
          )}
        </p>
      )}
    </div>
  );
}