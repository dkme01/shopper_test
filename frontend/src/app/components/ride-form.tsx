import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, Control } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import type { FormData } from '@/types/ride';

interface RideFormProps {
  control: Control<FormData>;
  isLoading: boolean;
  onSubmit: () => void;
}

export function RideForm({ control, isLoading, onSubmit }: RideFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4">
        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="User ID"
              className="w-full"
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="origin"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Origin"
              className="w-full"
              disabled={isLoading}
            />
          )}
        />
        <Controller
          name="destination"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Destination"
              className="w-full"
              disabled={isLoading}
            />
          )}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculating...
          </>
        ) : (
          'Get Estimate'
        )}
      </Button>
    </form>
  );
}

