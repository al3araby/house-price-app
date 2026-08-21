import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface BackgroundAmbienceProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'hero';
  children?: React.ReactNode;
}

const ORB_CONFIGS = [
  {
    id: 'orb-1',
    color: 'var(--color-accent)',
    top: '10%',
    left: '-10%',
    size: 'clamp(300px, 40vw, 600px)',
    blur: 'clamp(80px, 12vw, 160px)',
    delay: 0,
    duration: 20,
  },
  {
    id: 'orb-2',
    color: '#3b82f6',
    top: '50%',
    right: '-15%',
    size: 'clamp(250px, 35vw, 500px)',
    blur: 'clamp(60px, 10vw, 140px)',
    delay: 2,
    duration: 25,
  },
  {
    id: 'orb-3',
    color: '#e4405f',
    bottom: '10%',
    left: '10%',
    size: 'clamp(200px, 30vw, 450px)',
    blur: 'clamp(50px, 8vw, 120px)',
    delay: 4,
    duration: 30,
  },
  {
    id: 'orb-4',
    color: '#25d366',
    top: '30%',
    right: '20%',
    size: 'clamp(180px, 25vw, 350px)',
    blur: 'clamp(40px, 6vw, 100px)',
    delay: 6,
    duration: 35,
  },
];

const SUBTLE_ORB_CONFIGS = [
  {
    id: 'subtle-orb-1',
    color: 'var(--color-accent)',
    top: '20%',
    left: '5%',
    size: 'clamp(200px, 25vw, 350px)',
    blur: 'clamp(60px, 10vw, 120px)',
    opacity: 0.08,
    delay: 0,
    duration: 30,
  },
  {
    id: 'subtle-orb-2',
    color: '#3b82f6',
    bottom: '20%',
    right: '5%',
    size: 'clamp(180px, 22vw, 300px)',
    blur: 'clamp(50px, 8vw, 100px)',
    opacity: 0.06,
    delay: 3,
    duration: 35,
  },
  {
    id: 'subtle-orb-3',
    color: '#25d366',
    top: '60%',
    left: '50%',
    size: 'clamp(150px, 20vw, 280px)',
    blur: 'clamp(40px, 6vw, 80px)',
    opacity: 0.05,
    delay: 6,
    duration: 40,
  },
];

export function BackgroundAmbience({ className, variant = 'default', children }: BackgroundAmbienceProps) {
  const reducedMotion = useReducedMotion();

  const configs = variant === 'subtle' ? SUBTLE_ORB_CONFIGS : ORB_CONFIGS;

  const gridPattern = (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2314c8a8' fillOpacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        opacity: variant === 'subtle' ? 0.5 : 1,
      }}
    />
  );

  const meshGradients = (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 0%, var(--color-accent) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, #3b82f6 0%, transparent 50%),
          radial-gradient(ellipse 50% 60% at 10% 80%, #25d366 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 90% 90%, #e4405f 0%, transparent 50%)
        `,
        opacity: variant === 'hero' ? 0.15 : variant === 'subtle' ? 0.06 : 0.1,
      }}
    />
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden pointer-events-none',
        variant === 'hero' && 'h-[90vh] min-h-[600px]',
        className
      )}
      aria-hidden="true"
    >
      {/* Base mesh gradient layer */}
      {meshGradients}

      {/* Subtle grid pattern */}
      {gridPattern}

      {/* Floating gradient orbs */}
      {!reducedMotion && (
        <>
          {configs.map((orb) => (
            <motion.div
              key={orb.id}
              className="absolute pointer-events-none rounded-full"
              style={{
                top: orb.top,
                bottom: orb.bottom,
                left: orb.left,
                right: orb.right,
                width: orb.size,
                height: orb.size,
                filter: `blur(${orb.blur})`,
                background: orb.color,
                opacity: 'opacity' in orb ? orb.opacity : (variant === 'hero' ? 0.18 : 0.12),
                transformOrigin: 'center',
              }}
              animate={{
                scale: [1, 1.15, 1],
                x: [0, variant === 'hero' ? 40 : 20, 0],
                y: [0, variant === 'hero' ? -30 : -15, 0],
              }}
              transition={{
                duration: orb.duration,
                delay: orb.delay,
                ease: 'easeInOut',
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}

      {/* Reduced motion fallback - static orbs */}
      {reducedMotion && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {configs.slice(0, 2).map((orb) => (
            <div
              key={orb.id}
              className="absolute rounded-full"
              style={{
                top: orb.top,
                bottom: orb.bottom,
                left: orb.left,
                right: orb.right,
                width: orb.size,
                height: orb.size,
                filter: `blur(${orb.blur})`,
                background: orb.color,
                opacity: 'opacity' in orb ? orb.opacity * 0.6 : (variant === 'hero' ? 0.1 : 0.07),
              }}
            />
          ))}
        </div>
      )}

      {/* Content slot */}
      {children && (
        <div className="relative z-10 pointer-events-auto" style={{ isolation: 'isolate' }}>
          {children}
        </div>
      )}
    </div>
  );
}