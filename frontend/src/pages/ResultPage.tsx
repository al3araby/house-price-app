import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { PriceHero } from '../components/PriceHero';
import { PropertySpecsGrid } from '../components/PropertySpecsGrid';
import { ActionRow } from '../components/ActionRow';
import { ModelInfoCard } from '../components/ModelInfoCard';
import { useToast } from '../hooks/useToast';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';

interface ResultLoadingState {
  status: 'loading' | 'ready' | 'error' | 'empty';
  request?: PredictionRequest;
  response?: PredictionResponse;
  error?: string;
}

export function ResultPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [state, setState] = React.useState<ResultLoadingState>({ status: 'loading' });
  const [apiStatus] = React.useState<'checking' | 'ok' | 'error'>('ok');

  React.useEffect(() => {
    const loadData = () => {
      try {
        const reqStr = sessionStorage.getItem('predictionRequest');
        const resStr = sessionStorage.getItem('predictionResponse');

        if (!reqStr || !resStr) {
          setState({ status: 'empty' });
          addToast({ message: 'No prediction found. Please make a prediction first.', variant: 'warning', duration: 3000 });
          navigate('/', { replace: true });
          return;
        }

        const request = JSON.parse(reqStr) as PredictionRequest;
        const response = JSON.parse(resStr) as PredictionResponse;
        setState({ status: 'ready', request, response });
      } catch {
        setState({ status: 'error', error: 'Failed to load prediction data.' });
      }
    };

    loadData();
  }, [navigate, addToast]);

  const handlePredictAgain = () => {
    sessionStorage.removeItem('predictionRequest');
    sessionStorage.removeItem('predictionResponse');
    navigate('/');
  };

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center">
        <NavBar apiStatus={apiStatus} />
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-20 w-64 bg-elevated rounded-xl" />
          <div className="h-4 w-32 bg-elevated rounded" />
        </div>
      </div>
    );
  }

  if (state.status !== 'ready' || !state.request || !state.response) {
    return (
      <div className="min-h-screen bg-background font-body flex items-center justify-center">
        <NavBar apiStatus={apiStatus} />
        <div className="text-center">
          <p className="text-body text-muted">{state.error || 'No prediction found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 rounded-lg bg-accent px-6 py-2 text-background font-medium hover:bg-accent/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <NavBar apiStatus={apiStatus} />

      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Price Hero */}
          <PriceHero
            price={state.response.predicted_price}
            location={state.request.location}
            animate
          />

          <div className="mt-10 grid gap-10">
            {/* Property Specs Grid */}
            <section>
              <PropertySpecsGrid request={state.request} />
            </section>

            {/* Action Row */}
            <section>
              <ActionRow
                onPredictAgain={handlePredictAgain}
                price={state.response.predicted_price}
                location={state.request.location}
              />
            </section>

            {/* Model Info */}
            <section className="mt-6">
              <ModelInfoCard />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
