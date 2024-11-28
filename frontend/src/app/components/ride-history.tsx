import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Driver, FormData, Ride } from '@/types/ride';
import { Loader2 } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';

interface RideHistoryProps {
  rides: Ride[];
  availableDrivers: Driver[];
  isLoading: boolean;
  control: Control<FormData>;
  onDriverFilterChange: (driverId: string) => void;
  onClearFilter: () => void;
}

export function RideHistory({
  rides,
  availableDrivers,
  isLoading,
  control,
  onDriverFilterChange,
  onClearFilter
}: RideHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Controller
          name="driverId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onDriverFilterChange(value);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Driver" />
              </SelectTrigger>
              <SelectContent>
                {availableDrivers.map(driver => (
                  <SelectItem
                    key={driver.id}
                    value={driver.id.toString()}
                  >
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Button
          variant="outline"
          onClick={onClearFilter}
        >
          Clear Filter
        </Button>
      </div>

      <div className="space-y-2">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="p-4 border rounded-lg space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{new Date(ride.date).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">Driver: {ride.driver.name}</p>
              </div>
              <p className="font-semibold">R$ {ride.value}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">From</p>
                <p>{ride.origin}</p>
              </div>
              <div>
                <p className="text-muted-foreground">To</p>
                <p>{ride.destination}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <p>{ride.distance}km</p>
              <p>{ride.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

