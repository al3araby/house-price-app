import * as React from 'react';
import { Link } from 'react-router-dom';
import { User, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { DeveloperCard } from './DeveloperCard';
import { useToast } from '../hooks/useToast';

interface NavBarProps {
  apiStatus: 'checking' | 'ok' | 'error';
}

export function NavBar({ apiStatus }: NavBarProps) {
  const { addToast } = useToast();
  const [devCardOpen, setDevCardOpen] = React.useState(false);

  const handleDevOpen = () => {
    setDevCardOpen(true);
    addToast({ message: 'Opening developer contact', variant: 'info', duration: 1500 });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[30] border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 font-display text-heading-md font-semibold text-text hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-lg px-2"
          aria-label="HousePrice - Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent" aria-hidden="true">
            <Zap className="h-5 w-5" />
          </span>
          <span className="hidden sm:block">HousePrice</span>
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
          <button
            type="button"
            onClick={handleDevOpen}
            className="flex items-center gap-2 rounded-lg bg-elevated px-4 py-2 text-body font-medium text-text transition-all duration-150 ease-out-expo hover:bg-accent/10 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-haspopup="dialog"
            aria-label="Developer contact"
          >
            <User className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">المطور</span>
          </button>

          <DeveloperCard open={devCardOpen} onClose={() => setDevCardOpen(false)} />
        </div>
      </div>
    </header>
  );
}