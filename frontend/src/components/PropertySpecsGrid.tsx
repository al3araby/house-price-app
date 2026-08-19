import { motion } from 'framer-motion';
import {
  MapPin,
  Square,
  Building2,
  Bath,
  SquarePen,
  Car,
  Home,
  ArrowUpDown,
  Key,
  Compass,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { PredictionRequest } from '../types/prediction';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PropertySpecsGridProps {
  request: PredictionRequest;
}

const SPEC_CONFIG = [
  { key: 'location', label: 'Location', icon: MapPin, getValue: (r: PredictionRequest) => r.location },
  { key: 'carpet_area_sqft', label: 'Carpet Area', icon: Square, getValue: (r: PredictionRequest) => `${r.carpet_area_sqft.toLocaleString('en-IN')} sqft` },
  { key: 'floor_num', label: 'Floor', icon: Building2, getValue: (r: PredictionRequest) => (r.floor_num === 0 ? 'Ground Floor' : `Floor ${r.floor_num}`) },
  { key: 'bathroom', label: 'Bathrooms', icon: Bath, getValue: (r: PredictionRequest) => String(r.bathroom) },
  { key: 'balcony', label: 'Balconies', icon: SquarePen, getValue: (r: PredictionRequest) => String(r.balcony) },
  { key: 'car_parking_num', label: 'Parking', icon: Car, getValue: (r: PredictionRequest) => String(r.car_parking_num) },
  { key: 'furnishing', label: 'Furnishing', icon: Home, getValue: (r: PredictionRequest) => r.furnishing },
  { key: 'transaction', label: 'Transaction', icon: ArrowUpDown, getValue: (r: PredictionRequest) => r.transaction },
  { key: 'ownership', label: 'Ownership', icon: Key, getValue: (r: PredictionRequest) => r.ownership },
  { key: 'facing', label: 'Facing', icon: Compass, getValue: (r: PredictionRequest) => r.facing },
];

export function PropertySpecsGrid({ request }: PropertySpecsGridProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-label="Property specifications" className="w-full">
      <h2 className="sr-only">Property Details</h2>
      <div
        className={cn(
          'grid gap-4',
          // Mobile: single column cards
          'sm:grid-cols-1',
          // Tablet: 2-col zigzag
          'md:grid-cols-2',
          // Desktop: 2-col with wider cards
          'lg:gap-5 lg:px-2'
        )}
        role="list"
      >
        {SPEC_CONFIG.map((spec, index) => {
          const Icon = spec.icon;
          const value = spec.getValue(request);
          const isEven = index % 2 === 0;

          return (
            <motion.article
              key={spec.key}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'flex items-center gap-4 rounded-xl p-4 transition-colors duration-150 ease-out-expo',
                'group relative overflow-hidden',
                // Zigzag: alternate surface/elevated backgrounds
                isEven ? 'bg-surface' : 'bg-elevated/50',
                'hover:bg-elevated',
                // Desktop zigzag visual: alternating border-left accent
                'md:before:content-none',
                'focus-within:ring-2 focus-within:ring-accent focus-within:ring-inset'
              )}
              role="listitem"
              tabIndex={0}
            >
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                  isEven ? 'bg-accent/10' : 'bg-accent/5',
                  'group-hover:bg-accent/20 transition-colors duration-150'
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <dt className="text-caption font-medium text-muted uppercase tracking-wider">
                  {spec.label}
                </dt>
                <dd className="mt-0.5 text-body font-medium text-text truncate">
                  {value}
                </dd>
              </div>
              {/* Zigzag accent bar on desktop */}
              <div
                className={cn(
                  'absolute left-0 top-0 bottom-0 w-[3px]',
                  isEven ? 'bg-accent/30' : 'bg-transparent',
                  'md:block hidden',
                  'group-hover:bg-accent/60 transition-colors duration-150'
                )}
                aria-hidden="true"
              />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}