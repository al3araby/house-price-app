import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/Select';
import { Stepper } from './ui/Stepper';
import { Combobox } from './ui/Combobox';
import { Separator } from './ui/Separator';
import { useToast } from '../hooks/useToast';
import type { PredictionRequest } from '../types/prediction';

const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'] as const;
const TRANSACTION_OPTIONS = ['New Property', 'Resale', 'Other', 'Rent/Lease'] as const;
const OWNERSHIP_OPTIONS = ['Freehold', 'Co-operative Society', 'Power Of Attorney', 'Leasehold'] as const;
const FACING_OPTIONS = [
  'East',
  'West',
  'North',
  'South',
  'North - East',
  'North - West',
  'South - East',
  'South -West',
] as const;

const predictionSchema = z.object({
  location: z.string().min(1, 'Please select a location'),
  carpet_area_sqft: z.coerce.number().min(100, 'Minimum 100 sqft').max(10000, 'Maximum 10,000 sqft'),
  floor_num: z.coerce.number().min(0, 'Floor cannot be negative').max(100, 'Maximum 100 floors'),
  bathroom: z.coerce.number().min(1, 'Must have at least 1 bathroom').max(10, 'Maximum 10 bathrooms'),
  balcony: z.coerce.number().min(0, 'Balcony cannot be negative').max(10, 'Maximum 10 balconies'),
  car_parking_num: z.coerce.number().min(0, 'Parking cannot be negative').max(5, 'Maximum 5 parking spaces'),
  furnishing: z.enum(FURNISHING_OPTIONS),
  transaction: z.enum(TRANSACTION_OPTIONS),
  ownership: z.enum(OWNERSHIP_OPTIONS),
  facing: z.enum(FACING_OPTIONS),
});

interface PredictionFormProps {
  onSubmit: (data: PredictionRequest) => Promise<void>;
  isSubmitting?: boolean;
  locations: string[];
  apiStatus: 'checking' | 'ok' | 'error';
}

export function PredictionForm({ onSubmit, isSubmitting = false, locations, apiStatus }: PredictionFormProps) {
  const { addToast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<PredictionRequest>({
    resolver: zodResolver(predictionSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      location: '',
      carpet_area_sqft: 0,
      floor_num: 0,
      bathroom: 1,
      balcony: 0,
      car_parking_num: 0,
      furnishing: 'Unfurnished',
      transaction: 'Resale',
      ownership: 'Freehold',
      facing: 'North',
    },
  });

  // Auto-select first location if available
  React.useEffect(() => {
    if (locations.length > 0 && !watch('location')) {
      setValue('location', locations[0], { shouldValidate: true });
    }
  }, [locations, setValue, watch]);

  const onSubmitHandler = async (data: PredictionRequest) => {
    try {
      await onSubmit(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Prediction failed. Please try again.';
      addToast({ message, variant: 'error', duration: 5000 });
    }
  };

  if (!mounted) {
    return (
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 animate-pulse" aria-busy="true">
        <div className="space-y-4" role="status" aria-label="Loading form">
          <div className="h-10 w-3/4 bg-elevated rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 w-full bg-elevated rounded-lg" />
            <div className="h-10 w-full bg-elevated rounded-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 w-full bg-elevated rounded-lg" />
            <div className="h-10 w-full bg-elevated rounded-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 w-full bg-elevated rounded-lg" />
            <div className="h-10 w-full bg-elevated rounded-lg" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-10 w-full bg-elevated rounded-lg" />
            <div className="h-10 w-full bg-elevated rounded-lg" />
          </div>
          <div className="h-12 w-full bg-elevated rounded-lg" />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6" noValidate>
      {/* Group 1: Location + Area */}
      <div className="space-y-4">
        <h3 className="font-display text-heading-sm font-semibold text-text">Location & Area</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="location">Location</Label>
            <Combobox
              id="location"
              value={watch('location')}
              onChange={(v) => setValue('location', v, { shouldValidate: true })}
              options={locations}
              placeholder="Select location..."
              error={!!errors.location}
              errorText={errors.location?.message}
              disabled={isSubmitting}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? 'location-error' : undefined}
            />
          </div>
          <div>
            <Label htmlFor="carpet_area_sqft">Carpet Area (sqft)</Label>
            <Input
              id="carpet_area_sqft"
              type="number"
              min={100}
              max={10000}
              step={50}
              placeholder="e.g., 1000"
              error={!!errors.carpet_area_sqft}
              errorText={errors.carpet_area_sqft?.message}
              disabled={isSubmitting}
              {...register('carpet_area_sqft')}
              aria-invalid={!!errors.carpet_area_sqft}
              aria-describedby={errors.carpet_area_sqft ? 'carpet_area_sqft-error' : undefined}
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Group 2: Floor + Bathrooms + Balconies + Parking */}
      <div className="space-y-4">
        <h3 className="font-display text-heading-sm font-semibold text-text">Property Configuration</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="floor_num">Floor</Label>
            <Stepper
              id="floor_num"
              value={watch('floor_num')}
              onChange={(v) => setValue('floor_num', v, { shouldValidate: true })}
              min={0}
              max={100}
              step={1}
              label="Floor"
              error={!!errors.floor_num}
              errorText={errors.floor_num?.message}
              helperText="0 = Ground floor"
              disabled={isSubmitting}
              aria-invalid={!!errors.floor_num}
              aria-describedby={errors.floor_num ? 'floor_num-error' : 'floor_num-helper'}
            />
          </div>
          <div>
            <Label htmlFor="bathroom">Bathrooms</Label>
            <Stepper
              id="bathroom"
              value={watch('bathroom')}
              onChange={(v) => setValue('bathroom', v, { shouldValidate: true })}
              min={1}
              max={10}
              step={1}
              label="Bathrooms"
              error={!!errors.bathroom}
              errorText={errors.bathroom?.message}
              disabled={isSubmitting}
              aria-invalid={!!errors.bathroom}
              aria-describedby={errors.bathroom ? 'bathroom-error' : undefined}
            />
          </div>
          <div>
            <Label htmlFor="balcony">Balconies</Label>
            <Stepper
              id="balcony"
              value={watch('balcony')}
              onChange={(v) => setValue('balcony', v, { shouldValidate: true })}
              min={0}
              max={10}
              step={1}
              label="Balconies"
              error={!!errors.balcony}
              errorText={errors.balcony?.message}
              disabled={isSubmitting}
              aria-invalid={!!errors.balcony}
              aria-describedby={errors.balcony ? 'balcony-error' : undefined}
            />
          </div>
          <div>
            <Label htmlFor="car_parking_num">Parking</Label>
            <Stepper
              id="car_parking_num"
              value={watch('car_parking_num')}
              onChange={(v) => setValue('car_parking_num', v, { shouldValidate: true })}
              min={0}
              max={5}
              step={1}
              label="Parking Spaces"
              error={!!errors.car_parking_num}
              errorText={errors.car_parking_num?.message}
              disabled={isSubmitting}
              aria-invalid={!!errors.car_parking_num}
              aria-describedby={errors.car_parking_num ? 'car_parking_num-error' : undefined}
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Group 3: Furnishing + Transaction + Ownership + Facing */}
      <div className="space-y-4">
        <h3 className="font-display text-heading-sm font-semibold text-text">Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="furnishing">Furnishing</Label>
            <Select onValueChange={(v) => setValue('furnishing', v as any)}>
              <SelectTrigger
                id="furnishing"
                error={!!errors.furnishing}
                disabled={isSubmitting}
                aria-invalid={!!errors.furnishing}
                aria-describedby={errors.furnishing ? 'furnishing-error' : undefined}
              >
                <SelectValue placeholder="Select furnishing..." />
              </SelectTrigger>
              <SelectContent>
                {FURNISHING_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.furnishing && (
              <p id="furnishing-error" className="mt-1.5 text-body-sm text-danger" role="alert">
                {errors.furnishing.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="transaction">Transaction</Label>
            <Select onValueChange={(v) => setValue('transaction', v as any)}>
              <SelectTrigger
                id="transaction"
                error={!!errors.transaction}
                disabled={isSubmitting}
                aria-invalid={!!errors.transaction}
                aria-describedby={errors.transaction ? 'transaction-error' : undefined}
              >
                <SelectValue placeholder="Select transaction..." />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.transaction && (
              <p id="transaction-error" className="mt-1.5 text-body-sm text-danger" role="alert">
                {errors.transaction.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="ownership">Ownership</Label>
            <Select onValueChange={(v) => setValue('ownership', v as any)}>
              <SelectTrigger
                id="ownership"
                error={!!errors.ownership}
                disabled={isSubmitting}
                aria-invalid={!!errors.ownership}
                aria-describedby={errors.ownership ? 'ownership-error' : undefined}
              >
                <SelectValue placeholder="Select ownership..." />
              </SelectTrigger>
              <SelectContent>
                {OWNERSHIP_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ownership && (
              <p id="ownership-error" className="mt-1.5 text-body-sm text-danger" role="alert">
                {errors.ownership.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="facing">Facing</Label>
            <Select onValueChange={(v) => setValue('facing', v as any)}>
              <SelectTrigger
                id="facing"
                error={!!errors.facing}
                disabled={isSubmitting}
                aria-invalid={!!errors.facing}
                aria-describedby={errors.facing ? 'facing-error' : undefined}
              >
                <SelectValue placeholder="Select facing..." />
              </SelectTrigger>
              <SelectContent>
                {FACING_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facing && (
              <p id="facing-error" className="mt-1.5 text-body-sm text-danger" role="alert">
                {errors.facing.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting || !isValid || apiStatus === 'error'}
        >
          {isSubmitting ? 'Predicting...' : 'Predict Price'}
        </Button>
      </div>

      {apiStatus === 'error' && (
        <p className="text-center text-body-sm text-warning" role="status">
          API unavailable — predictions may fail
        </p>
      )}
    </form>
  );
}