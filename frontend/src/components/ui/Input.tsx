import * as React from 'react';
import { cn } from '../../lib/utils';

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

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-body-sm font-medium text-text mb-2">
            {label}
          </label>
        )}
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
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={describedBy}
          {...props}
        />
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
);
Input.displayName = 'Input';

export { Input };