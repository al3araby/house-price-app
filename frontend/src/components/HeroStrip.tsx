import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { PropertyCard, type PropertyShowcase } from './PropertyCard';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroStripProps {
  properties?: PropertyShowcase[];
  snapAlign?: 'start' | 'center' | 'end';
  className?: string;
}

const DEFAULT_PROPERTIES: PropertyShowcase[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop',
    location: 'Whitefield, Bangalore',
    price: '₹1.2 Cr',
    bhk: '3 BHK',
    area: '1,450 sqft',
    propertyType: 'apartment',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    location: 'Bandra, Mumbai',
    price: '₹3.8 Cr',
    bhk: '4 BHK',
    area: '2,100 sqft',
    propertyType: 'villa',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
    location: 'Gachibowli, Hyderabad',
    price: '₹95 Lac',
    bhk: '2 BHK',
    area: '1,180 sqft',
    propertyType: 'apartment',
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
    location: 'Noida Sector 62',
    price: '₹1.6 Cr',
    bhk: '3 BHK',
    area: '1,650 sqft',
    propertyType: 'apartment',
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&h=300&fit=crop',
    location: 'Salt Lake, Kolkata',
    price: '₹72 Lac',
    bhk: '2 BHK',
    area: '985 sqft',
    propertyType: 'apartment',
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
    location: 'Vastrapur, Ahmedabad',
    price: '₹1.1 Cr',
    bhk: '3 BHK',
    area: '1,520 sqft',
    propertyType: 'villa',
  },
];

export function HeroStrip({ properties = DEFAULT_PROPERTIES, snapAlign = 'start', className }: HeroStripProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(true);

  const updateScrollButtons = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      aria-label={`Property showcase, ${properties.length} properties`}
      className={cn('relative w-full', className)}
    >
      {/* Desktop scroll arrows */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden lg:block">
        {showLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll properties left"
            className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-md backdrop-blur-sm transition-all hover:bg-elevated hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {showRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll properties right"
            className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/90 text-text shadow-md backdrop-blur-sm transition-all hover:bg-elevated hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <motion.div
        ref={scrollRef}
        role="list"
        aria-label="Property showcase"
        initial={false}
        className={cn(
          'flex gap-4 overflow-x-auto pb-4',
          'scroll-smooth snap-x snap-mandatory',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          // Mobile: vertical stack
          'max-sm:flex-col max-sm:overflow-visible max-sm:snap-none',
          'max-sm:[&>*]:w-full'
        )}
        style={{ scrollSnapAlign: snapAlign }}
      >
        {properties.map((property, i) => (
          <PropertyCard key={property.id} property={property} index={i} />
        ))}
      </motion.div>
    </section>
  );
}
