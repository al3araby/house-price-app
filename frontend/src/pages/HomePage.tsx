import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroStrip } from '../components/HeroStrip';
import { ProjectIntro } from '../components/ProjectIntro';
import { PredictionFormCard } from '../components/PredictionFormCard';
import { PredictionForm } from '../components/PredictionForm';
import { NavBar } from '../components/NavBar';
import { predictionApi } from '../api/predictionClient';
import { useToast } from '../hooks/useToast';
import type { PredictionRequest } from '../types/prediction';

export function HomePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [apiStatus, setApiStatus] = React.useState<'checking' | 'ok' | 'error'>('checking');
  const [locations, setLocations] = React.useState<string[]>([]);
  const [formSubmitting, setFormSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<{ message: string; action?: { label: string; onClick: () => void } } | null>(null);

  // Load API health and locations
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [health, locs] = await Promise.all([
          predictionApi.health(),
          predictionApi.getLocations(),
        ]);
        setApiStatus(health.status === 'ok' ? 'ok' : 'error');
        setLocations(locs);
      } catch {
        setApiStatus('error');
        setLocations([]);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (request: PredictionRequest) => {
    setFormSubmitting(true);
    setFormError(null);
    try {
      const response = await predictionApi.predict(request);
      // Store in sessionStorage for result page
      sessionStorage.setItem('predictionRequest', JSON.stringify(request));
      sessionStorage.setItem('predictionResponse', JSON.stringify(response));
      navigate('/result');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Prediction failed. Please try again.';
      setFormError({
        message,
        action: { label: 'Dismiss', onClick: () => setFormError(null) },
      });
      addToast({ message, variant: 'error', duration: 5000 });
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <NavBar apiStatus={apiStatus} />

      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero Strip - Signature Element */}
          <section aria-label="Featured properties" className="mb-10 sm:mb-14">
            <HeroStrip />
          </section>

          {/* Project Intro */}
          <section className="mb-10 sm:mb-14 max-w-4xl mx-auto">
            <ProjectIntro defaultOpen={false} />
          </section>

          {/* Prediction Form Card */}
          <PredictionFormCard
            title="Predict Your Property Price"
            description="Enter property details to get an instant price estimate"
            loading={formSubmitting}
            error={formError as any}
            onDismissError={() => setFormError(null)}
          >
            <PredictionForm
              onSubmit={handleSubmit}
              isSubmitting={formSubmitting}
              locations={locations}
              apiStatus={apiStatus}
            />
          </PredictionFormCard>
        </div>
      </main>
    </div>
  );
}