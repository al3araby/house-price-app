import { useState, useEffect } from 'react';
import { predictionApi } from '../api/predictionClient';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';

function formatPrice(price: number): string {
  if (price >= 1e7) {
    return `₹${(price / 1e7).toFixed(2)} Cr`;
  } else if (price >= 1e5) {
    return `₹${(price / 1e5).toFixed(2)} Lac`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [request, setRequest] = useState<PredictionRequest | null>(null);

  useEffect(() => {
    const runPrediction = async () => {
      try {
        const stored = sessionStorage.getItem('predictionRequest');
        if (!stored) {
          throw new Error('No prediction request found. Please go back and fill the form.');
        }
        const req: PredictionRequest = JSON.parse(stored);
        setRequest(req);

        const res = await predictionApi.predict(req);
        setResult(res);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    runPrediction();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prediction Result</h1>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Calculating price...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-red-500 text-2xl">⚠</span>
              <h2 className="text-xl font-semibold text-red-800">Error</h2>
            </div>
            <p className="text-red-700">{error}</p>
            <a
              href="/"
              className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Go Back
            </a>
          </div>
        )}

        {result && request && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-2">Estimated Price</p>
              <p className="text-5xl font-bold text-indigo-600">{formatPrice(result.predicted_price)}</p>
            </div>

            {/* Property Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2 font-medium text-gray-800 capitalize">
                    {request.location.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Area:</span>
                  <span className="ml-2 font-medium text-gray-800">{request.carpet_area_sqft} sqft</span>
                </div>
                <div>
                  <span className="text-gray-500">Floor:</span>
                  <span className="ml-2 font-medium text-gray-800">
                    {request.floor_num === 0 ? 'Ground' : request.floor_num}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Bathrooms:</span>
                  <span className="ml-2 font-medium text-gray-800">{request.bathroom}</span>
                </div>
                <div>
                  <span className="text-gray-500">Balcony:</span>
                  <span className="ml-2 font-medium text-gray-800">{request.balcony}</span>
                </div>
                <div>
                  <span className="text-gray-500">Furnishing:</span>
                  <span className="ml-2 font-medium text-gray-800">{request.furnishing}</span>
                </div>
                <div>
                  <span className="text-gray-500">Transaction:</span>
                  <span className="ml-2 font-medium text-gray-800">{request.transaction}</span>
                </div>
                <div>
                  <span className="text-gray-500">Ownership:</span>
                  <span className="ml-2 font-medium text-gray-800">{request.ownership}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="/"
                className="inline-block px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Predict Another
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}