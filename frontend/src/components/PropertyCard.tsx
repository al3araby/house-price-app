import * as React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
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
  const [imageError, setImageError] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const staggerDelay = reducedMotion ? 0 : index * 80;

  // Motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform for 3D tilt
  const rotateX = useTransform(springY, [-50, 50], [8, -8]);
  const rotateY = useTransform(springX, [-50, 50], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left - rect.width / 2;
    const yPos = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: xPos, y: yPos });
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveCard = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: staggerDelay / 1000 }}
      whileHover={reducedMotion ? undefined : { scale: 1.015, y: -6 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveCard}
      onMouseMove={handleMouseMove}
      style={{
        transform: reducedMotion ? undefined : { rotateX, rotateY },
        perspective: 1000,
        transformStyle: 'preserve-3d',
      } as React.CSSProperties}
      className={cn(
        'group relative flex h-full w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl bg-surface shadow-sm',
        'sm:w-[320px] lg:w-[360px]',
        'transition-shadow duration-300 ease-out-expo',
        isHovered && !reducedMotion ? 'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03),0_0_60px_-20px_var(--color-accent)_0.15]' : 'hover:shadow-lg',
        'snap-start focus-within:ring-2 focus-within:ring-accent'
      )}
      role="listitem"
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-elevated">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-elevated" aria-hidden="true" />
        )}
        {imageError ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface to-elevated px-4 text-center"
            aria-hidden="true"
          >
            <MapPin className="h-8 w-8 text-subtle" />
            <span className="text-body-sm font-medium text-muted">{property.location}</span>
          </div>
        ) : (
          <motion.img
            src={property.imageUrl}
            alt={`${property.bhk} property in ${property.location}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            animate={{ scale: isHovered && !reducedMotion ? 1.05 : 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'h-full w-full object-cover will-change-transform',
              'transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent"
          aria-hidden="true"
        />
        {/* Magnetic glow overlay */}
        {!reducedMotion && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${50 + mousePosition.x / 8}% ${50 + mousePosition.y / 8}%, var(--color-accent) 0%, transparent 70%)`,
              opacity: 0.08,
            }}
            animate={{ opacity: [0, 0.08, 0.08] }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        {/* Type badge */}
        <motion.span
          className="absolute left-3 top-3 rounded-full bg-accent/90 px-3 py-1 text-caption font-medium uppercase tracking-wide text-background"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ zIndex: reducedMotion ? undefined : 20 }}
        >
          {property.propertyType}
        </motion.span>
        {/* Price */}
        <motion.span
          className="absolute bottom-3 right-3 rounded-lg bg-background/80 px-3 py-1.5 font-utility text-body font-medium text-accent backdrop-blur-sm"
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--color-accent)' }}
          style={{ zIndex: reducedMotion ? undefined : 20 }}
        >
          {property.price}
        </motion.span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <motion.div
          style={{
            transform: reducedMotion ? undefined : { z: 10 },
            transformStyle: 'preserve-3d',
          } as React.CSSProperties}
        >
          <div className="flex items-center gap-1.5 text-muted">
            <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span className="text-body-sm font-medium text-text">{property.location}</span>
          </div>
        </motion.div>
        <motion.div
          style={{
            transform: reducedMotion ? undefined : { z: 10 },
            transformStyle: 'preserve-3d',
          } as React.CSSProperties}
        >
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
        </motion.div>
      </div>

      {/* Bottom accent line that expands on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent/20"
        initial={false}
        animate={{ scaleX: isHovered && !reducedMotion ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ transformOrigin: 'center' }}
        aria-hidden="true"
      />
    </motion.article>
  );
}
