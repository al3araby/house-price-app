import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Database, BrainCircuit, Code2, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProjectIntroProps {
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const EDITORIAL_COLUMNS = [
  {
    icon: Database,
    title: 'The Data',
    items: [
      '187K+ property listings across India',
      'Sourced from Kaggle housing datasets',
      'Cleaned: deduplicated, outlier-capped, null-imputed',
      'Feature-engineered for locality and BHK trends',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'The Model',
    items: [
      'RandomForest Regressor (scikit-learn)',
      '93.4% R² on held-out test set',
      '5-fold cross-validation for stability',
      'Blends numeric (area, floor) + categorical features',
    ],
  },
  {
    icon: Code2,
    title: 'The Stack',
    items: [
      'FastAPI serving predictions (/api/v1/predict)',
      'React + TypeScript SPA frontend',
      'Tailwind CSS for the design system',
      'Dockerized, tested with pytest + CI',
    ],
  },
  {
    icon: Users,
    title: 'The Team',
    items: [
      'A solo student-built ML project',
      'End-to-end: data, model, and product',
      'Open-source on GitHub',
      'Built to learn and to ship something real',
    ],
  },
];

export function ProjectIntro({ defaultOpen = false, onToggle }: ProjectIntroProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const reducedMotion = useReducedMotion();
  const contentId = 'project-intro-content';

  // Scroll-triggered entrance animation
  const { ref: sectionRef, isVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px',
    triggerOnce: true,
  });

  const toggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  return (
    <section className="w-full" ref={sectionRef}>
      <motion.div
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={isVisible && !reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="group/toggle relative overflow-hidden">
          {/* Accent line that expands on hover - always visible when open */}
          {!reducedMotion && (
            <motion.div
              initial={{ scaleX: open ? 1 : 0 }}
              animate={{ scaleX: open ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-accent via-[#3b82f6] to-[#25d366]"
            />
          )}
          {!reducedMotion && (
            <div
              className="absolute top-0 left-0 right-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-accent via-[#3b82f6] to-[#25d366] transition-transform duration-300 ease-out-expo group-hover/toggle:scale-x-100"
            />
          )}
          <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-surface px-6 py-5 text-left transition-all duration-300 ease-out-expo hover:border-accent/50 hover:bg-elevated/60 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div>
          <h2 className="font-display text-heading-md font-semibold text-text transition-colors duration-200 group-hover:text-accent">About this Project</h2>
          <p className="mt-1 text-body-sm text-muted">
            How the prediction works: data, model, stack, and team
          </p>
        </div>
        <ChevronDown
          className={cn(
            'h-6 w-6 shrink-0 text-muted transition-transform duration-base ease-out-expo group-hover:text-accent',
            open && 'rotate-180 text-accent'
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            key="content"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={reducedMotion ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {EDITORIAL_COLUMNS.map((col, i) => (
                <motion.div
                  key={col.title}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: reducedMotion ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={
                    reducedMotion
                      ? undefined
                      : {
                          y: -6,
                          scale: 1.025,
                          boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--color-accent)20',
                          transition: { type: 'spring', stiffness: 400, damping: 25 },
                        }
                  }
                  className="group flex flex-col gap-3 rounded-xl border border-border bg-elevated/50 p-5 transition-all duration-500 ease-out-expo hover:border-accent/60 hover:bg-elevated/80 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(20,200,168,0.15)]"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={reducedMotion ? undefined : { scale: 1.15, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20"
                    >
                      <col.icon className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    </motion.div>
                    <h3 className="font-display text-heading-sm font-semibold text-text transition-colors duration-300 group-hover:text-accent">{col.title}</h3>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {col.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-body-sm leading-relaxed text-muted transition-colors duration-300 group-hover:text-text/90"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
