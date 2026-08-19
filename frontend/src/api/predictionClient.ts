import type { PredictionRequest, PredictionResponse, HealthResponse } from '../types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_V1 = `${API_BASE_URL}/api/v1`;

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const error = await response.json();
      if (error.detail) {
        if (Array.isArray(error.detail)) {
          errorMessage = error.detail.map((e: { msg: string }) => e.msg).join(', ');
        } else {
          errorMessage = error.detail;
        }
      }
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const predictionApi = {
  async health(): Promise<HealthResponse> {
    return fetchJson<HealthResponse>(`${API_V1}/health`);
  },

  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    return fetchJson<PredictionResponse>(`${API_V1}/predict`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async getLocations(): Promise<string[]> {
    return fetchJson<string[]>(`${API_V1}/locations`);
  },
};