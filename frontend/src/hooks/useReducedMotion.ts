import { useEffect, useState } from 'react';

/**
 * Hook to detect whether the user prefers reduced motion.
 * Returns true if the user has set prefers-reduced-motion: reduce.
 */
export function useReducedMotion(): boolean {
  const getInitial = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  const [reducedMotion, setReducedMotion] = useState(getInitial);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
