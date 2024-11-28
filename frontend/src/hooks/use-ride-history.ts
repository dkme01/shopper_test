import { useState } from 'react';
import { rideService } from '@/lib/api';
import type { Driver, Ride } from '@/types/ride';

export function useRideHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);

  const fetchRideHistory = async (userId: string, driverId?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rideService.getRideHistory(userId, driverId);
      setRides(response.rides || []);

      const uniqueDrivers = Array.from(
        new Set(response.rides.map((ride: Ride) => ride.driver))
      );
      setAvailableDrivers(uniqueDrivers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRides([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rides,
    availableDrivers,
    isLoading,
    error,
    fetchRideHistory
  };
}

