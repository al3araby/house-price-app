import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { User, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { DeveloperCard } from './DeveloperCard';
import { useToast } from '../hooks/useToast';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NavBarProps {
  apiStatus: 'checking' | 'ok' | 'error';
}

export function NavBar({ apiStatus }: NavBarProps) {
  const { addToast } = useToast();
  const [devCardOpen, setDevCardOpen] = React.useState(false);
  const reducedMotion = useReducedMotion();

  // Motion values for logo hover animation
  const logoHoverScale = useMotionValue(1);
  const springLogoScale = useSpring(logoHoverScale, { stiffness: 400, damping: 25 });

  // Motion values for developer button
  const devBtnHoverScale = useMotionValue(1);
  const springDevBtnScale = useSpring(devBtnHoverScale, { stiffness: 400, damping: 25 });

  // Ripple effect state
  const [logoRipple, setLogoRipple] = React.useState<{ x: number; y: number } | null>(null);
  const [devBtnRipple, setDevBtnRipple] = React.useState<{ x: number; y: number } | null>(null);

  const handleDevOpen = () => {
    setDevCardOpen(true);
    addToast({ message: 'Opening developer contact', variant: 'info', duration: 1500 });
  };

  const handleLogoMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left - rect.width / 2;
    logoHoverScale.set(1 + Math.abs(xPos) / rect.width * 0.08);
  };

  const handleLogoMouseLeave = () => {
    if (reducedMotion) return;
    logoHoverScale.set(1);
  };

  const handleLogoMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLogoRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setTimeout(() => setLogoRipple(null), 500);
  };

  const handleDevBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = e.clientX - rect.left - rect.width / 2;
    devBtnHoverScale.set(1 + Math.abs(xPos) / rect.width * 0.06);
  };

  const handleDevBtnMouseLeave = () => {
    if (reducedMotion) return;
    devBtnHoverScale.set(1);
  };

  const handleDevBtnMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDevBtnRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setTimeout(() => setDevBtnRipple(null), 500);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[30] border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="relative mt-0.5 flex items-center gap-3 font-display text-heading-md font-semibold text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-lg px-2 group"
          aria-label="HousePrice - Home"
          onMouseMove={handleLogoMouseMove}
          onMouseLeave={handleLogoMouseLeave}
          onMouseDown={handleLogoMouseDown}
          style={{
            transform: reducedMotion ? undefined : { scale: springLogoScale },
            transformOrigin: 'center',
          } as React.CSSProperties}
        >
          {/* Logo ripple effect */}
          {!reducedMotion && logoRipple && (
            <motion.span
              key="logo-ripple"
              initial={{ scale: 0, opacity: 0.35 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute pointer-events-none rounded-full"
              style={{
                left: logoRipple.x,
                top: logoRipple.y,
                width: 24,
                height: 24,
                marginLeft: -12,
                marginTop: -12,
                background: 'var(--color-accent)',
                zIndex: 0,
              }}
            />
          )}
          <span
            className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent transition-all duration-150 ease-out-expo group-hover:bg-accent/25"
            aria-hidden="true"
          >
            <Zap className="h-5 w-5" />
          </span>
          <span className="hidden sm:block relative z-10">HousePrice</span>
        </Link>

        {/* API Status */}
        <div className="hidden items-center gap-2 rounded-lg bg-elevated px-3 py-1.5 text-body-sm md:flex">
          <div
            className={cn(
              'flex h-2 w-2 rounded-full transition-colors',
              apiStatus === 'ok' && 'bg-success',
              apiStatus === 'error' && 'bg-danger',
              apiStatus === 'checking' && 'bg-warning animate-pulse'
            )}
            aria-hidden="true"
          />
          <span className={cn('font-medium', apiStatus === 'ok' && 'text-success', apiStatus === 'error' && 'text-danger', apiStatus === 'checking' && 'text-warning')}>
            {apiStatus === 'ok' ? 'API Connected' : apiStatus === 'error' ? 'API Unavailable' : 'Checking...'}
          </span>
        </div>

        {/* Developer Button */}
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={handleDevOpen}
            onMouseMove={handleDevBtnMouseMove}
            onMouseLeave={handleDevBtnMouseLeave}
            onMouseDown={handleDevBtnMouseDown}
            className="relative flex items-center gap-2 rounded-lg bg-elevated px-4 py-2 text-body font-medium text-text transition-all duration-150 ease-out-expo hover:bg-accent/10 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent overflow-hidden group"
            aria-haspopup="dialog"
            aria-label="Developer contact"
            style={{
              transform: reducedMotion ? undefined : { scale: springDevBtnScale },
              transformOrigin: 'center',
            } as React.CSSProperties}
            whileHover={!reducedMotion ? { scale: 1.02 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.96 } : undefined}
          >
            {/* Developer button ripple effect */}
            {!reducedMotion && devBtnRipple && (
              <motion.span
                key="dev-btn-ripple"
                initial={{ scale: 0, opacity: 0.35 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: devBtnRipple.x,
                  top: devBtnRipple.y,
                  width: 24,
                  height: 24,
                  marginLeft: -12,
                  marginTop: -12,
                  background: 'var(--color-accent)',
                  zIndex: 0,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <User className="h-5 w-5 transition-transform duration-150 ease-out-expo group-hover:scale-110" aria-hidden="true" />
              <span className="hidden sm:inline">المطور</span>
            </span>
            {/* Hover glow overlay */}
            {!reducedMotion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 0.12, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 pointer-events-none rounded-lg"
                style={{
                  background: 'radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)',
                  zIndex: 0,
                }}
              />
            )}
          </motion.button>

          <DeveloperCard open={devCardOpen} onClose={() => setDevCardOpen(false)} />
        </div>
      </div>
    </header>
  );
}