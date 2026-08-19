import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface ModelMetrics {
  model: string;
  trainingSamples: number;
  testSamples: number;
  mae: number;
  rmse: number;
  r2: number;
  cvFolds: number;
  cvRmseMean: number;
  cvRmseStd: number;
  numericFeatures: number;
  categoricalFeatures: number;
}

interface ModelInfoCardProps {
  metrics?: ModelMetrics;
}

const DEFAULT_METRICS: ModelMetrics = {
  model: 'RandomForestRegressor (scikit-learn)',
  trainingSamples: 76210,
  testSamples: 19053,
  mae: 9.52e5,
  rmse: 3.43e6,
  r2: 0.934,
  cvFolds: 5,
  cvRmseMean: 6.56e6,
  cvRmseStd: 2.48e6,
  numericFeatures: 5,
  categoricalFeatures: 4,
};

export function ModelInfoCard({ metrics = DEFAULT_METRICS }: ModelInfoCardProps) {
  const [open, setOpen] = React.useState(false);
  const reducedMotion = useReducedMotion();
  const contentId = 'model-info-content';

  const formatMetric = (val: number): string => {
    if (val >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`;
    if (val >= 1e5) return `₹${(val / 1e5).toFixed(2)} Lac`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <section className="w-full max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={contentId}
        className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-surface px-6 py-5 text-left transition-colors duration-150 ease-out-expo hover:border-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div>
          <h2 className="font-display text-heading-md font-semibold text-text">Model & Methodology</h2>
          <p className="mt-1 text-body-sm text-muted">Technical details, metrics, and disclaimers</p>
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
            <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Metrics Grid */}
              <div className="rounded-xl border border-border bg-elevated/50 p-5 sm:col-span-2 lg:col-span-1">
                <h3 className="font-display text-heading-sm font-semibold text-text mb-4">Performance Metrics</h3>
                <dl className="space-y-4 text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Training Samples</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">
                      {metrics.trainingSamples.toLocaleString('en-IN')}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Test Samples</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">
                      {metrics.testSamples.toLocaleString('en-IN')}
                    </dd>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between">
                    <dt className="text-muted">MAE</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{formatMetric(metrics.mae)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">RMSE</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{formatMetric(metrics.rmse)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">R² Score</dt>
                    <dd className="font-medium text-accent font-utility tabular-nums">{metrics.r2.toFixed(3)}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-border bg-elevated/50 p-5 sm:col-span-2 lg:col-span-1">
                <h3 className="font-display text-heading-sm font-semibold text-text mb-4">Cross-Validation</h3>
                <dl className="space-y-4 text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Folds</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{metrics.cvFolds}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Mean RMSE</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{formatMetric(metrics.cvRmseMean)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Std Dev</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{formatMetric(metrics.cvRmseStd)}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-border bg-elevated/50 p-5 sm:col-span-2 lg:col-span-1">
                <h3 className="font-display text-heading-sm font-semibold text-text mb-4">Features</h3>
                <dl className="space-y-4 text-body-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    <dt className="text-muted flex-1">Numeric Features</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{metrics.numericFeatures}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    <dt className="text-muted flex-1">Categorical Features</dt>
                    <dd className="font-medium text-text font-utility tabular-nums">{metrics.categoricalFeatures}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
                    <dt className="text-muted flex-1">Top-N Grouping</dt>
                    <dd className="font-medium text-text">Applied</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 rounded-xl border border-warning/30 bg-warning/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning mt-0.5" aria-hidden="true" />
                <div>
                  <h4 className="font-display text-body font-semibold text-warning">Important Disclaimer</h4>
                  <p className="mt-2 text-body-sm text-muted leading-relaxed">
                    Predictions are estimates based on historical data. Actual prices vary by market conditions,
                    negotiation, and property specifics. This model has not been validated for every locality
                    and may not reflect recent market shifts. Consult a professional for financial decisions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}