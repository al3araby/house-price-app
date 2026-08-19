import * as React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-border transition-all duration-base ease-out-expo',
        elevated ? 'bg-elevated shadow-md' : 'bg-surface shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
