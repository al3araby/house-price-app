import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { error?: boolean }
>(({ className, children, error, ...props }, ref) => {
  const reducedMotion = useReducedMotion();
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex w-full items-center justify-between px-4 py-3 rounded-lg bg-surface border transition-all duration-fast ease-out-expo relative overflow-hidden',
        'text-text data-[placeholder]:text-subtle',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        '[&>span]:line-clamp-1',
        error && 'border-danger focus:ring-danger focus:border-danger',
        !error && 'border-border hover:border-subtle',
        isFocused && !error && 'ring-2 ring-accent/30',
        className
      )}
      aria-invalid={error}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <motion.span
          initial={false}
          animate={{ rotate: isFocused ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden="true" />
        </motion.span>
      </SelectPrimitive.Icon>
      {/* Focus glow overlay */}
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
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => {
  const reducedMotion = useReducedMotion();

  return (
    <SelectPrimitive.Portal>
      <AnimatePresence>
        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.98 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <SelectPrimitive.Content
            ref={ref}
            className={cn(
              'relative z-[60] max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-elevated text-text shadow-lg',
              className
            )}
            position={position}
            {...props}
          >
            <SelectPrimitive.Viewport
              className={cn(
                'p-1',
                position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
              )}
            >
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </motion.div>
      </AnimatePresence>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-3 text-body outline-none overflow-hidden',
      'focus:bg-accent/15 focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Check className="h-4 w-4 text-accent" aria-hidden="true" />
        </motion.span>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    {/* Hover ripple */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1, opacity: 0.1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 bg-accent pointer-events-none"
    />
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
