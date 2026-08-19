import { useState, useEffect } from 'react';
import { PredictionForm } from '../components/PredictionForm';
import { predictionApi } from '../api/predictionClient';
import type { PredictionRequest } from '../types/prediction';

export function HomePage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  const handleSubmit = (request: PredictionRequest) => {
    // Store request in sessionStorage and navigate to result page
    sessionStorage.setItem('predictionRequest', JSON.stringify(request));
    window.location.href = '/result';
  };

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await predictionApi.health();
        setApiStatus('ok');
      } catch {
        setApiStatus('error');
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">House Price Predictor</h1>
          <p className="text-lg text-gray-600">
            Enter property details to get an instant price prediction
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              apiStatus === 'ok' ? 'bg-green-500' :
              apiStatus === 'error' ? 'bg-red-500' :
              'bg-yellow-500 animate-pulse'
            }`}></span>
            <span className="text-sm text-gray-500">
              {apiStatus === 'ok' ? 'API Connected' :
               apiStatus === 'error' ? 'API Unavailable' :
               'Checking API...'}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <PredictionForm onSubmit={handleSubmit} />
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by a Random Forest regression model trained on 187K+ Indian property listings</p>
        </div>
      </div>
    </div>
  );
}