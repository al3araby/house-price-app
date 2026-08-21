import * as React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Link, Mail, Zap, Heart } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface FooterLink {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
}

const SOCIAL_LINKS: FooterLink[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/al3araby',
    icon: GitBranch,
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/moelaraby1',
    icon: Link,
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:alaraby1856@gmail.com',
    icon: Mail,
  },
];

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'About', href: '#' },
];

const navLinkClass =
  'text-body-sm text-muted hover:text-accent transition-colors duration-200 ease-out-expo focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded';

export function Footer() {
  const reducedMotion = useReducedMotion();
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="relative border-t border-border bg-surface/50 overflow-hidden"
      role="contentinfo"
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent"
                aria-hidden="true"
              >
                <Zap className="h-6 w-6" />
              </span>
              <span className="font-display text-heading-md font-semibold text-text">
                HousePrice
              </span>
            </div>
            <p className="text-body-sm text-muted max-w-sm leading-relaxed">
              ML-powered property price predictions for the Indian real estate
              market. Built with a RandomForest model trained on 187K+ listings.
            </p>
            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon!;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    aria-label={link.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-elevated/50 text-muted transition-all duration-200 ease-out-expo hover:border-accent/40 hover:bg-accent/10 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    whileHover={reducedMotion ? undefined : { scale: 1.1, y: -2 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-heading-sm font-semibold text-text mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Quick links">
              <a href="#predict" className={navLinkClass}>
                Predict Price
              </a>
              <a href="#how-it-works" className={navLinkClass}>
                How It Works
              </a>
              <a href="#about" className={navLinkClass}>
                About Project
              </a>
              <a href="#properties" className={navLinkClass}>
                Featured Properties
              </a>
            </nav>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-display text-heading-sm font-semibold text-text mb-4">
              Legal
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Legal links">
              {LEGAL_LINKS.map((link) => (
                <a key={link.label} href={link.href} className={navLinkClass}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-subtle flex items-center gap-1.5">
            <span>© {currentYear} HousePrice. Made with</span>
            <Heart className="h-4 w-4 text-danger" aria-hidden="true" />
            <span>and machine learning</span>
          </p>
          <p className="text-body-sm text-subtle">
            Predictions are estimates. Not financial advice.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}