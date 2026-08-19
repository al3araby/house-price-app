import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Globe, Camera, MessageCircle, Code, X, GripHorizontal } from 'lucide-react';
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
  },
  {
    platform: 'instagram' as const,
    label: 'Instagram',
    url: 'https://instagram.com/priv.3rby',
    icon: Camera,
    brandColor: '#E4405F',
  },
  {
    platform: 'whatsapp' as const,
    label: 'WhatsApp',
    url: 'https://wa.me/+201090390942',
    icon: MessageCircle,
    brandColor: '#25D366',
  },
  {
    platform: 'github' as const,
    label: 'GitHub',
    url: 'https://github.com/al3araby',
    icon: Code,
    brandColor: '#FFFFFF',
  },
];

export function DeveloperCard({ open, onClose }: DeveloperCardProps) {
  const reducedMotion = useReducedMotion();
  const { addToast } = useToast();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 639px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSocialClick = (_platform: string, label: string) => {
    addToast({ message: `Opening ${label}`, variant: 'info', duration: 2000 });
    // Close card after opening link
    setTimeout(onClose, 100);
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
                <button
                  type="button"
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((link, i) => (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(link.platform, link.label)}
                  initial={reducedMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: reducedMotion ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-14 items-center gap-4 rounded-xl border border-border bg-elevated px-4 transition-all duration-150 ease-out-expo hover:border-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  style={{ ['--brand-color' as any]: link.brandColor }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150"
                    style={{ backgroundColor: `color-mix(in srgb, ${link.brandColor} 15%, transparent)` }}
                    aria-hidden="true"
                  >
                    <link.icon className="h-5 w-5" style={{ color: link.brandColor }} />
                  </span>
                  <span className="flex-1 text-body font-medium text-text">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : (
        /* Desktop: Dropdown */
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[45] bg-transparent" />
          <Dialog.Content
            className={cn(
              'fixed right-4 top-16 z-[50] w-[320px] rounded-2xl border border-border bg-surface p-5 shadow-xl',
              'focus:outline-none',
              reducedMotion ? '' : 'data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up'
            )}
            aria-labelledby="dev-card-title"
          >
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title id="dev-card-title" className="font-display text-heading-sm font-semibold text-text">
                Connect with the Developer
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((link, i) => (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick(link.platform, link.label)}
                  initial={reducedMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: reducedMotion ? 0 : i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-12 items-center gap-3 rounded-xl border border-border bg-elevated px-4 transition-all duration-150 ease-out-expo hover:border-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  style={{ ['--brand-color' as any]: link.brandColor }}
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150"
                    style={{ backgroundColor: `color-mix(in srgb, ${link.brandColor} 15%, transparent)` }}
                    aria-hidden="true"
                  >
                    <link.icon className="h-5 w-5" style={{ color: link.brandColor }} />
                  </span>
                  <span className="flex-1 text-body font-medium text-text">{link.label}</span>
                </motion.a>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}