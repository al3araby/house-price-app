import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Database, BrainCircuit, Code2, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';

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

  const toggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  return (
    <section className="w-full">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-surface px-6 py-5 text-left transition-colors duration-150 ease-out-expo hover:border-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div>
          <h2 className="font-display text-heading-md font-semibold text-text">About this Project</h2>
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
                  className="flex flex-col gap-3 rounded-xl border border-border bg-elevated/50 p-5"
                >
                  <div className="flex items-center gap-2">
                    <col.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    <h3 className="font-display text-heading-sm font-semibold text-text">{col.title}</h3>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {col.items.map((item, idx) => (
                      <li key={idx} className="text-body-sm leading-relaxed text-muted">
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
    </section>
  );
}
