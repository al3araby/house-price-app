import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Zap, ShieldCheck, Quote } from 'lucide-react';
import { Button } from './ui/Button';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface HeroWelcomeProps {
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
}

const STATS = [
  {
    icon: TrendingUp,
    label: '187K+',
    sublabel: 'Property listings',
  },
  {
    icon: Sparkles,
    label: '93.4%',
    sublabel: 'Model R² accuracy',
  },
  {
    icon: Zap,
    label: '< 1s',
    sublabel: 'Instant predictions',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HeroWelcome({ onCtaClick, onSecondaryClick }: HeroWelcomeProps) {
  const reducedMotion = useReducedMotion();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

  const handlePrimary = () => {
    if (onCtaClick) onCtaClick();
  };

  const handleSecondary = () => {
    if (onSecondaryClick) onSecondaryClick();
  };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-welcome-title"
      className="relative min-h-[88vh] flex items-center"
    >
      {/* Content overlay */}
      <motion.div
        className="relative z-10 w-full"
        variants={reducedMotion ? undefined : containerVariants}
        initial={reducedMotion ? false : 'hidden'}
        animate={isVisible || reducedMotion ? 'visible' : 'hidden'}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <motion.div
            variants={reducedMotion ? undefined : itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 backdrop-blur-sm px-4 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            <span className="text-body-sm font-medium text-muted">
              AI-Powered Real Estate Valuation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-welcome-title"
            variants={reducedMotion ? undefined : itemVariants}
            className="font-display font-bold text-text leading-tight text-4xl sm:text-5xl lg:text-7xl tracking-tight"
          >
            Predict Your Property
            <span className="block bg-gradient-to-r from-accent via-[#3b82f6] to-[#25d366] bg-clip-text text-transparent">
              Price Instantly
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={reducedMotion ? undefined : itemVariants}
            className="mx-auto mt-6 max-w-2xl text-body-lg sm:text-xl text-muted leading-relaxed"
          >
            Machine learning estimates for Indian real estate. Enter your property
            details and get accurate valuations powered by 187K+ listings in
            seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={reducedMotion ? undefined : itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={handlePrimary}
              className="group min-w-[200px]"
              aria-label="Get your property estimate"
            >
              Get Estimate
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={handleSecondary}
              className="min-w-[200px]"
              aria-label="Learn how it works"
            >
              <Quote className="mr-2 h-5 w-5" aria-hidden="true" />
              How It Works
            </Button>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            variants={reducedMotion ? undefined : itemVariants}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface/40 backdrop-blur-sm px-6 py-5 transition-all duration-300 hover:border-accent/40 hover:bg-surface/60"
              >
                <stat.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-text">
                  {stat.label}
                </span>
                <span className="text-body-sm text-muted text-center">
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Security badge */}
          <motion.div
            variants={reducedMotion ? undefined : itemVariants}
            className="mt-12 flex items-center justify-center gap-2 text-body-sm text-subtle"
          >
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>Free to use • No sign-up required • Privacy-first</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}