import { useState, useEffect } from 'react';
import type { PredictionRequest } from '../types/prediction';
import { predictionApi } from '../api/predictionClient';

interface FormErrors {
  [key: string]: string | undefined;
}

const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'] as const;
const TRANSACTION_OPTIONS = ['New Property', 'Resale', 'Other', 'Rent/Lease'] as const;
const OWNERSHIP_OPTIONS = ['Freehold', 'Co-operative Society', 'Power Of Attorney', 'Leasehold'] as const;
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North - East', 'North - West', 'South - East', 'South -West'] as const;

export function PredictionForm({ onSubmit }: { onSubmit: (request: PredictionRequest) => void }) {
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PredictionRequest>({
    location: '',
    carpet_area_sqft: 0,
    floor_num: 0,
    bathroom: 1,
    balcony: 0,
    furnishing: 'Unfurnished',
    transaction: 'Resale',
    ownership: 'Freehold',
    facing: 'East',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locs = await predictionApi.getLocations();
        setLocations(locs);
        if (locs.length > 0) {
          setFormData((prev) => ({ ...prev, location: locs[0] }));
        }
      } catch (err) {
        console.error('Failed to load locations:', err);
      }
    };
    loadLocations();
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.location) newErrors.location = 'Please select a location';
    if (formData.carpet_area_sqft <= 0) newErrors.carpet_area_sqft = 'Area must be greater than 0';
    if (formData.floor_num < 0) newErrors.floor_num = 'Floor cannot be negative';
    if (formData.bathroom < 1) newErrors.bathroom = 'Must have at least 1 bathroom';
    if (formData.balcony < 0) newErrors.balcony = 'Balcony cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('area') || name.includes('floor') || name.includes('bathroom') || name.includes('balcony')
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    onSubmit(formData);
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location */}
      <div>
        <label className={labelClass} htmlFor="location">Location</label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        >
          <option value="">Select a location...</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc.charAt(0).toUpperCase() + loc.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
        {errors.location && <p className={errorClass}>{errors.location}</p>}
      </div>

      {/* Carpet Area */}
      <div>
        <label className={labelClass} htmlFor="carpet_area_sqft">Carpet Area (sqft)</label>
        <input
          id="carpet_area_sqft"
          name="carpet_area_sqft"
          type="number"
          min="0"
          step="1"
          value={formData.carpet_area_sqft || ''}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., 1000"
          disabled={loading}
        />
        {errors.carpet_area_sqft && <p className={errorClass}>{errors.carpet_area_sqft}</p>}
      </div>

      {/* Floor */}
      <div>
        <label className={labelClass} htmlFor="floor_num">Floor Number</label>
        <input
          id="floor_num"
          name="floor_num"
          type="number"
          min="0"
          step="1"
          value={formData.floor_num || ''}
          onChange={handleChange}
          className={inputClass}
          placeholder="0 = Ground floor"
          disabled={loading}
        />
        {errors.floor_num && <p className={errorClass}>{errors.floor_num}</p>}
      </div>

      {/* Bathrooms */}
      <div>
        <label className={labelClass} htmlFor="bathroom">Bathrooms</label>
        <input
          id="bathroom"
          name="bathroom"
          type="number"
          min="1"
          step="1"
          value={formData.bathroom || ''}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., 2"
          disabled={loading}
        />
        {errors.bathroom && <p className={errorClass}>{errors.bathroom}</p>}
      </div>

      {/* Balcony */}
      <div>
        <label className={labelClass} htmlFor="balcony">Balcony</label>
        <input
          id="balcony"
          name="balcony"
          type="number"
          min="0"
          step="1"
          value={formData.balcony || ''}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., 1"
          disabled={loading}
        />
        {errors.balcony && <p className={errorClass}>{errors.balcony}</p>}
      </div>

      {/* Furnishing */}
      <div>
        <label className={labelClass} htmlFor="furnishing">Furnishing</label>
        <select
          id="furnishing"
          name="furnishing"
          value={formData.furnishing}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        >
          {FURNISHING_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Transaction */}
      <div>
        <label className={labelClass} htmlFor="transaction">Transaction</label>
        <select
          id="transaction"
          name="transaction"
          value={formData.transaction}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        >
          {TRANSACTION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Ownership */}
      <div>
        <label className={labelClass} htmlFor="ownership">Ownership</label>
        <select
          id="ownership"
          name="ownership"
          value={formData.ownership}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        >
          {OWNERSHIP_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Facing */}
      <div>
        <label className={labelClass} htmlFor="facing">Facing</label>
        <select
          id="facing"
          name="facing"
          value={formData.facing}
          onChange={handleChange}
          className={inputClass}
          disabled={loading}
        >
          {FACING_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-50"
      >
        {loading ? 'Predicting...' : 'Predict Price'}
      </button>
    </form>
  );
}