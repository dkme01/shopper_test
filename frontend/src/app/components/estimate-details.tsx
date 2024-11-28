import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DriverCard } from "./drive-card";
import type { EstimateResponse, DriverOption } from '@/types/ride';

interface EstimateDetailsProps {
  estimate: EstimateResponse;
  selectedDriver: DriverOption | null;
  isLoading: boolean;
  onDriverSelect: (driver: DriverOption) => void;
  onConfirm: () => void;
}

export function EstimateDetails({
  estimate,
  selectedDriver,
  isLoading,
  onDriverSelect,
  onConfirm
}: EstimateDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Distance</p>
          <p className="text-lg font-semibold">{estimate.distance}km</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Duration</p>
          <p className="text-lg font-semibold">
            {Math.floor(parseInt(estimate.duration) / 3600)}h {parseInt(estimate.duration) % 60}min
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Available Drivers</h3>
        <div className="grid gap-3">
          {estimate.options.map((driver) => (
            <DriverCard
              key={driver.id}
              driver={driver}
              isSelected={selectedDriver?.id === driver.id}
              onSelect={onDriverSelect}
            />
          ))}
        </div>
      </div>

      {selectedDriver && (
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            'Confirm Ride'
          )}
        </Button>
      )}
    </div>
  );
}

