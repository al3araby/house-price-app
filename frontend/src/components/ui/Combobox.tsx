import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
  errorText?: string;
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
 */
export function Combobox({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  errorText,
  id,
  onBlur,
  disabled,
  ...ariaProps
}: ComboboxProps) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, search]);

  return (
    <SelectPrimitive.Root
      value={value || undefined}
      onValueChange={(v) => {
        onChange(v);
        setOpen(false);
      }}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          'flex w-full items-center justify-between gap-2 px-4 py-3 rounded-lg bg-surface border transition-all duration-fast ease-out-expo',
          'text-text data-[placeholder]:text-subtle',
          'focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent',
          'disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
          '[&>span]:line-clamp-1 [&>span]:text-left',
          error && 'border-danger focus:ring-danger focus:border-danger',
          !error && 'border-border hover:border-subtle',
        )}
        onBlur={onBlur}
        aria-invalid={ariaProps['aria-invalid']}
        aria-label={ariaProps['aria-label']}
        aria-describedby={ariaProps['aria-describedby']}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-[60] max-h-80 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-elevated text-text shadow-lg animate-slide-down"
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-subtle" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search locations..."
              className="w-full bg-transparent text-body-sm outline-none placeholder:text-subtle"
              aria-label="Search locations"
            />
          </div>
          <SelectPrimitive.Viewport className="p-1 max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-body-sm text-muted">
                No locations found
              </div>
            ) : (
              filtered.map((opt) => (
                <SelectPrimitive.Item
                  key={opt}
                  value={opt}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-3 text-body outline-none',
                    'focus:bg-accent/15 focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  )}
                >
                  <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-4 w-4 text-accent" aria-hidden="true" />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <SelectPrimitive.ItemText>{opt}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))
            )}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
