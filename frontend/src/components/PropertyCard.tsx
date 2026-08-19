import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Maximize, Home } from 'lucide-react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface PropertyShowcase {
  id: string;
  imageUrl: string;
  location: string;
  price: string;
  bhk: string;
  area: string;
  propertyType: 'apartment' | 'villa' | 'plot';
}

interface PropertyCardProps {
  property: PropertyShowcase;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const reducedMotion = useReducedMotion();

  const staggerDelay = reducedMotion ? 0 : index * 80;

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: staggerDelay / 1000 }}
      whileHover={reducedMotion ? undefined : { scale: 1.02, y: -4 }}
      className={cn(
        'group relative flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm',
        'sm:w-[320px] lg:w-[360px]',
        'transition-shadow duration-200 ease-out-expo hover:shadow-lg',
        'snap-start focus-within:ring-2 focus-within:ring-accent'
      )}
      role="listitem"
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-elevated" aria-hidden="true" />
        )}
        <img
          src={property.imageUrl}
          alt={`${property.bhk} property in ${property.location}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-150 ease-out',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"
          aria-hidden="true"
        />
        {/* Type badge */}
        <span className="absolute left-3 top-3 rounded-full bg-accent/90 px-3 py-1 text-caption font-medium uppercase tracking-wide text-background">
          {property.propertyType}
        </span>
        {/* Price */}
        <span className="absolute bottom-3 right-3 rounded-lg bg-background/80 px-3 py-1.5 font-utility text-body font-medium text-accent backdrop-blur-sm">
          {property.price}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-muted">
          <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-body-sm font-medium text-text">{property.location}</span>
        </div>
        <div className="flex items-center gap-4 text-muted">
          <span className="flex items-center gap-1.5 text-body-sm">
            <Home className="h-4 w-4 text-subtle" aria-hidden="true" />
            {property.bhk}
          </span>
          <span className="flex items-center gap-1.5 text-body-sm">
            <Maximize className="h-4 w-4 text-subtle" aria-hidden="true" />
            {property.area}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
