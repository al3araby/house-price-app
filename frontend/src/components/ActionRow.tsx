import * as React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Share2, Bookmark } from 'lucide-react';
import { Button } from './ui/Button';
import { useToast } from '../hooks/useToast';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ActionRowProps {
  onPredictAgain: () => void;
  onSave?: () => void;
  price: number;
  location: string;
}

export function ActionRow({ onPredictAgain, onSave, price, location }: ActionRowProps) {
  const { addToast } = useToast();
  const reducedMotion = useReducedMotion();
  const [shareLoading, setShareLoading] = React.useState(false);
  const [saveDisabled] = React.useState(true); // MVP: save is disabled

  const handleShare = async () => {
    setShareLoading(true);
    try {
      const text = `Estimated property price: ${price.toLocaleString('en-IN')} (${location})`;
      if (navigator.share) {
        await navigator.share({ title: 'Property Price Prediction', text });
        addToast({ message: 'Shared successfully', variant: 'success', duration: 3000 });
      } else {
        await navigator.clipboard.writeText(text);
        addToast({ message: 'Copied to clipboard', variant: 'success', duration: 3000 });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        addToast({ message: 'Failed to share', variant: 'error', duration: 3000 });
      }
    } finally {
      setShareLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="sm:flex-1"
      >
        <Button size="lg" fullWidth onClick={onPredictAgain}>
          <RefreshCw className="h-5 w-5" aria-hidden="true" />
          Predict Another
        </Button>
      </motion.div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="sm:flex-1"
      >
        <Button variant="secondary" size="lg" fullWidth onClick={handleShare} loading={shareLoading}>
          <Share2 className="h-5 w-5" aria-hidden="true" />
          {shareLoading ? 'Sharing...' : 'Share'}
        </Button>
      </motion.div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="sm:flex-1"
      >
        <Button variant="ghost" size="lg" fullWidth onClick={onSave} disabled={saveDisabled} className="opacity-50">
          <Bookmark className="h-5 w-5" aria-hidden="true" />
          Save
        </Button>
      </motion.div>
    </div>
  );
}