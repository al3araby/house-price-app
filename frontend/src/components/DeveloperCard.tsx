import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Globe, Camera, MessageCircle, Code, X, GripHorizontal, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useToast } from '../hooks/useToast';

interface DeveloperCardProps {
  open: boolean;
  onClose: () => void;
}

const SOCIAL_LINKS = [
  {
    platform: 'facebook' as const,
    label: 'Facebook',
    url: 'https://facebook.com/el3araby',
    icon: Globe,
    brandColor: '#1877F2',
    gradient: ['#1877F2', '#42a5f5'],
  },
  {
    platform: 'instagram' as const,
    label: 'Instagram',
    url: 'https://instagram.com/priv.3rby',
    icon: Camera,
    brandColor: '#E4405F',
    gradient: ['#E4405F', '#f77737', '#fcb045', '#fccc63'],
  },
  {
    platform: 'whatsapp' as const,
    label: 'WhatsApp',
    url: 'https://wa.me/+201090390942',
    icon: MessageCircle,
    brandColor: '#25D366',
    gradient: ['#25D366', '#128C7E'],
  },
  {
    platform: 'github' as const,
    label: 'GitHub',
    url: 'https://github.com/al3araby',
    icon: Code,
    brandColor: '#FFFFFF',
    gradient: ['#FFFFFF', '#e0e0e0'],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 20, scale: 0.95 },
};

const iconVariants = {
  idle: { scale: 1, rotate: 0 },
  hover: { scale: 1.18, rotate: 10 },
  tap: { scale: 0.92 },
};

const shimmerVariants = {
  hidden: { x: '-150%', opacity: 0 },
  visible: { x: '150%', opacity: 0.5 },
  exit: { x: '250%', opacity: 0 },
};

export function DeveloperCard({ open, onClose }: DeveloperCardProps) {
  const reducedMotion = useReducedMotion();
  const { addToast } = useToast();
  const [isMobile, setIsMobile] = React.useState(false);

  // Mouse tracking for magnetic effect on desktop
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardSpringX = useSpring(cardX, { stiffness: 200, damping: 25 });
  const cardSpringY = useSpring(cardY, { stiffness: 200, damping: 25 });
  const cardRotateX = useTransform(cardSpringY, [-30, 30], [4, -4]);
  const cardRotateY = useTransform(cardSpringX, [-30, 30], [-4, 4]);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSocialClick = (_platform: string, label: string) => {
    addToast({ message: `Opening ${label}`, variant: 'info', duration: 2000 });
    setTimeout(onClose, 100);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    cardX.set(x * 0.3);
    cardY.set(y * 0.3);
  };

  const handleCardMouseLeave = () => {
    if (reducedMotion || isMobile) return;
    cardX.set(0);
    cardY.set(0);
  };

  const SocialLink = ({
    link,
    index,
    isMobile: mobile,
  }: {
    link: typeof SOCIAL_LINKS[0];
    index: number;
    isMobile: boolean;
  }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [ripple, setRipple] = React.useState<{ x: number; y: number } | null>(null);
    const isActive = isHovered || isFocused;

    // Magnetic motion values for each item
    const itemX = useMotionValue(0);
    const itemY = useMotionValue(0);
    const itemSpringX = useSpring(itemX, { stiffness: 400, damping: 35 });
    const itemSpringY = useSpring(itemY, { stiffness: 400, damping: 35 });
    const itemTranslateX = useTransform(itemSpringX, [-100, 100], [-8, 8]);
    const itemTranslateY = useTransform(itemSpringY, [-100, 100], [-4, 4]);

    const handleItemMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      itemX.set(x * 0.5);
      itemY.set(y * 0.5);
    };

    const handleItemMouseLeave = () => {
      if (reducedMotion) return;
      itemX.set(0);
      itemY.set(0);
    };

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      setRipple({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setTimeout(() => setRipple(null), 600);
    };

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={index}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { handleClick(e); handleSocialClick(link.platform, link.label); }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); handleItemMouseLeave(); }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseMove={handleItemMouseMove}
          className={cn(
            'group relative flex items-center gap-4 rounded-xl border bg-elevated overflow-hidden transition-all duration-300 ease-out-expo',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
            mobile
              ? 'h-14 px-4 w-full'
              : 'h-12 px-4 w-full min-w-[280px]'
          )}
          style={{
            borderColor: isActive ? link.brandColor : 'var(--color-border)',
            boxShadow: isActive
              ? `0 8px 32px -8px ${link.brandColor}40, 0 0 0 1px ${link.brandColor}30`
              : 'none',
            transform: reducedMotion ? undefined : {
              translateX: isActive ? '4px' : 0,
              ...(itemTranslateX.get() ? { x: itemTranslateX.get() } : {}),
              ...(itemTranslateY.get() ? { y: itemTranslateY.get() } : {}),
            },
          } as React.CSSProperties}
          whileHover={!reducedMotion ? { x: 4 } : undefined}
          whileTap={!reducedMotion ? { scale: 0.97 } : undefined}
        >
          {/* Ripple effect */}
          {!reducedMotion && ripple && (
            <motion.span
              key="ripple"
              initial={{ scale: 0, opacity: 0.4 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
                borderRadius: '50%',
                background: link.brandColor,
              }}
            />
          )}

          {/* Animated gradient border shine */}
          <AnimatePresence mode="wait">
            {isActive && !reducedMotion && (
              <motion.div
                key="shine"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={shimmerVariants}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, transparent, ${link.brandColor}40, transparent)`,
                  opacity: 0.7,
                }}
              />
            )}
          </AnimatePresence>

          {/* Background glow on hover */}
          {!reducedMotion && isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${link.brandColor} 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Icon container with magnetic 3D effect */}
          <motion.div
            style={{
              transform: reducedMotion ? undefined : {
                x: itemTranslateX.get(),
                y: itemTranslateY.get()
              },
              transformStyle: 'preserve-3d',
              backgroundColor: `color-mix(in srgb, ${link.brandColor} 15%, transparent)`,
              boxShadow: isActive
                ? `0 0 25px ${link.brandColor}50, inset 0 0 25px ${link.brandColor}30`
                : 'none',
            } as React.CSSProperties}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ease-out-expo"
            whileHover={iconVariants.hover}
            whileTap={iconVariants.tap}
            animate={isActive && !reducedMotion ? 'hover' : 'idle'}
          >
            <motion.span
              style={{
                transform: reducedMotion ? undefined : {
                  z: isActive ? 10 : 0,
                  rotateZ: isActive ? 0 : 0,
                },
              } as React.CSSProperties}
            >
              <link.icon
                className="h-5 w-5 transition-all duration-300"
                style={{
                  color: link.brandColor,
                  filter: isActive ? 'drop-shadow(0 0 10px currentColor)' : 'none'
                }}
                aria-hidden="true"
              />
            </motion.span>

            {/* Sparkle on hover - multiple particles */}
            <AnimatePresence>
              {isHovered && !reducedMotion && (
                <>
                  <motion.span
                    key="sparkle-1"
                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.4, delay: 0, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute -top-1 -right-1"
                    style={{ color: link.brandColor }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.span>
                  <motion.span
                    key="sparkle-2"
                    initial={{ scale: 0, opacity: 0, rotate: 45 }}
                    animate={{ scale: 0.8, opacity: 0.7, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute top-1 -right-2"
                    style={{ color: link.brandColor }}
                  >
                    <Sparkles className="h-3 w-3" />
                  </motion.span>
                  <motion.span
                    key="sparkle-3"
                    initial={{ scale: 0, opacity: 0, rotate: -90 }}
                    animate={{ scale: 0.6, opacity: 0.5, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute -top-2 right-1"
                    style={{ color: link.brandColor }}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Label with magnetic effect */}
          <motion.span
            style={{
              transform: reducedMotion ? undefined : { x: itemTranslateX.get() * 0.5 },
              color: isActive ? link.brandColor : 'var(--color-text)',
            } as React.CSSProperties}
            className="flex-1 text-body font-medium text-text transition-colors duration-200"
            whileHover={{ x: isActive ? 3 : 0 }}
          >
            {link.label}
          </motion.span>

          {/* External link indicator */}
          <motion.span
            className="opacity-0 transition-all duration-200 ease-out-expo"
            whileHover={{ opacity: 1, x: 4 }}
            style={{ color: link.brandColor }}
          >
            <Globe className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </motion.a>
      </motion.div>
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      {isMobile ? (
        /* Mobile: Bottom Sheet */
        <Dialog.Portal>
          <Dialog.Overlay
            className={cn(
              'fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm',
              'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out'
            )}
          />
          <Dialog.Content
            className={cn(
              'fixed inset-x-0 bottom-0 z-[50] rounded-t-2xl border-t border-border bg-surface p-6',
              'focus:outline-none',
              reducedMotion ? '' : 'data-[state=open]:animate-slide-up-sheet data-[state=closed]:animate-slide-down-sheet'
            )}
            aria-labelledby="dev-card-title"
          >
            <div className="mx-auto mb-4 w-12">
              <GripHorizontal className="h-6 w-6 text-subtle mx-auto" aria-hidden="true" />
            </div>

            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title id="dev-card-title" className="font-display text-heading-md font-semibold text-text">
                Connect with the Developer
              </Dialog.Title>
              <Dialog.Close asChild>
                <motion.button
                  type="button"
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </Dialog.Close>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="flex flex-col gap-3"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {SOCIAL_LINKS.map((link, i) => (
                <SocialLink key={link.platform} link={link} index={i} isMobile={true} />
              ))}
            </motion.div>

            {/* Footer badge */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-caption text-subtle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <motion.span
                whileHover={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="text-accent"
                aria-hidden="true"
              >
                <Sparkles className="h-4 w-4" />
              </motion.span>
              <span>Built with EL3ARABY</span>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : (
        /* Desktop: Dropdown with magnetic 3D tilt */
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[45] bg-transparent" />
          <Dialog.Content
            className={cn(
              'fixed right-4 top-24 z-[50] w-[340px] rounded-2xl border bg-surface p-5 shadow-xl',
              'focus:outline-none',
              reducedMotion ? '' : 'data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up'
            )}
            aria-labelledby="dev-card-title"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              borderColor: 'var(--color-border)',
              perspective: 1000,
              transformStyle: 'preserve-3d',
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 60px -20px var(--color-accent)10',
              transform: reducedMotion
                ? undefined
                : ({ rotateX: cardRotateX, rotateY: cardRotateY } as React.CSSProperties),
            } as React.CSSProperties}
          >
              {/* Header with decorative accent line */}
              <div className="relative mb-4">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, var(--color-accent), #3b82f6, #e4405f, #25d366)' }} />
                <div className="flex items-center justify-between">
                  <Dialog.Title id="dev-card-title" className="font-display text-heading-sm font-semibold text-text">
                    Connect with the Developer
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <motion.button
                      type="button"
                      aria-label="Close"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      whileHover={{ scale: 1.12, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </motion.button>
                  </Dialog.Close>
                </div>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="flex flex-col gap-2"
              >
                {SOCIAL_LINKS.map((link, i) => (
                  <SocialLink key={link.platform} link={link} index={i} isMobile={false} />
                ))}
              </motion.div>

              {/* Footer with subtle accent */}
              <motion.div
                className="mt-4 pt-4 flex items-center justify-center gap-2 border-t text-caption text-subtle"
                style={{ borderColor: 'var(--color-border)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                <motion.span
                  whileHover={{ scale: [1, 1.25, 1], rotate: [0, 15, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-accent"
                  aria-hidden="true"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.span>
                <span>Built with EL3ARABY</span>
              </motion.div>
            </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}