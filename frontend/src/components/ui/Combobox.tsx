import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
  errorText?: string;
  loading?: boolean;
  id?: string;
  onBlur?: () => void;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox built on Radix Select.
 * Shows a search input at the top of the dropdown and filters options.
 * Uses uncontrolled open state to avoid conflicts with Radix internal handling.
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  errorText,
  loading,
  id,
  onBlur,
  disabled,
  ...ariaProps
}: ComboboxProps) {
  const [search, setSearch] = React.useState('');
  const reducedMotion = useReducedMotion();
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <SelectPrimitive.Root
      value={value || undefined}
      onValueChange={onChange}
      disabled={disabled}
      onOpenChange={setIsOpen}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          'flex w-full items-center justify-between gap-2 px-4 py-3 rounded-lg bg-surface border transition-all duration-fast ease-out-expo relative overflow-hidden',
          'text-text data-[placeholder]:text-subtle',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
          '[&>span]:line-clamp-1 [&>span]:text-left',
          error && 'border-danger focus:ring-danger focus:border-danger',
          !error && 'border-border hover:border-subtle',
          isFocused && !error && 'ring-2 ring-accent/30',
        )}
        onBlur={() => { onBlur?.(); setIsFocused(false); }}
        onFocus={() => setIsFocused(true)}
        aria-invalid={ariaProps['aria-invalid']}
        aria-label={ariaProps['aria-label']}
        aria-describedby={ariaProps['aria-describedby']}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <motion.span
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
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

      <SelectPrimitive.Portal>
        <AnimatePresence>
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className="z-[60] max-h-80 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-elevated text-text shadow-lg"
            >
              <motion.div
                className="flex items-center gap-2 border-b border-border px-3 py-2"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Search className="h-4 w-4 text-subtle" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full bg-transparent text-body-sm outline-none placeholder:text-subtle"
                  aria-label="Search locations"
                />
              </motion.div>
              <SelectPrimitive.Viewport className="p-1 max-h-64 overflow-y-auto">
                {options.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-4 text-center text-body-sm text-muted"
                  >
                    {loading ? 'Loading locations...' : 'No locations available'}
                  </motion.div>
                ) : filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-3 py-4 text-center text-body-sm text-muted"
                  >
                    No locations match "{search}"
                  </motion.div>
                ) : (
                  filtered.map((opt, index) => (
                    <motion.div
                      key={opt}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reducedMotion ? 0 : index * 0.02, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <SelectPrimitive.Item
                        value={opt}
                        className={cn(
                          'relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-3 text-body outline-none overflow-hidden',
                          'focus:bg-accent/15 focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                        )}
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
                        <SelectPrimitive.ItemText>{opt}</SelectPrimitive.ItemText>
                        {/* Hover ripple */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 0.1 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute inset-0 bg-accent pointer-events-none"
                        />
                      </SelectPrimitive.Item>
                    </motion.div>
                  ))
                )}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </motion.div>
        </AnimatePresence>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
