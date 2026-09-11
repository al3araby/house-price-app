import * as React from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-body font-medium transition-all duration-fast ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-background hover:bg-accent/90 shadow-sm',
        secondary: 'border border-border bg-surface text-text hover:bg-elevated hover:border-subtle',
        ghost: 'text-text hover:bg-elevated',
        danger: 'bg-danger text-text hover:bg-danger/90',
        outline: 'border border-border bg-transparent text-text hover:bg-surface hover:border-accent/50',
      },
      size: {
        sm: 'h-9 px-4 text-body-sm',
        default: 'h-11 px-6 text-body',
        lg: 'h-12 px-8 text-body-lg',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  magnetic?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, loading = false, children, disabled, magnetic = true, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const reducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = React.useState(false);
    const [ripple, setRipple] = React.useState<{ x: number; y: number } | null>(null);

    // Magnetic motion values (used for ripple positioning and hover effects)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reducedMotion || disabled || loading || !magnetic) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const xPos = e.clientX - rect.left - rect.width / 2;
      const yPos = e.clientY - rect.top - rect.height / 2;
      x.set(xPos * 0.6);
      y.set(yPos * 0.6);
    };

    const handleMouseLeave = () => {
      if (reducedMotion || !magnetic) return;
      x.set(0);
      y.set(0);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (reducedMotion || disabled || loading) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTimeout(() => setRipple(null), 500);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeaveButton = () => {
      setIsHovered(false);
      handleMouseLeave();
    };

    // Magnetic style - use motion.div with style prop instead
    const magneticStyle = magnetic && !reducedMotion ? {
      transformStyle: 'preserve-3d' as const,
      perspective: 1000,
    } as React.CSSProperties : {};

    // Ripple color based on variant
    const getRippleColor = () => {
      if (variant === 'primary') return 'var(--color-background)';
      if (variant === 'danger') return 'var(--color-text)';
      return 'var(--color-accent)';
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeaveButton}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        style={magneticStyle}
        {...props}
      >
        {/* Ripple effect */}
        {!reducedMotion && ripple && (
          <motion.span
            key="ripple"
            initial={{ scale: 0, opacity: 0.35 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              background: getRippleColor(),
              zIndex: 0,
            }}
          />
        )}

        {/* Magnetic glow overlay - variant-aware */}
        {magnetic && !reducedMotion && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: variant === 'primary'
                ? 'radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)'
                : variant === 'danger'
                  ? 'radial-gradient(ellipse at center, var(--color-danger) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)',
              zIndex: 0,
            }}
          />
        )}

        <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {children}
        </span>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
