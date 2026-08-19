export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  transaction: 'New Property' | 'Resale' | 'Other' | 'Rent/Lease';
  ownership: 'Freehold' | 'Co-operative Society' | 'Power Of Attorney' | 'Leasehold';
  facing: 'East' | 'West' | 'North' | 'South' | 'North - East' | 'North - West' | 'South - East' | 'South -West';
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface HealthResponse {
  status: string;
}

export type Severity = 'info' | 'success' | 'warning' | 'danger';

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}