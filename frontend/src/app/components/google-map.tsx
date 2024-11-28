'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMap } from '@react-google-maps/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, MapPin, History } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RideForm } from '@/app/components/ride-form';
import { RideHistory } from '@/app/components/ride-history';
import { EstimateDetails } from '@/app/components/estimate-details';
import { useRideHistory } from '@/hooks/use-ride-history';
import { MAP_CONFIG } from '@/lib/constants';
import { rideFormSchema } from '@/lib/validation';
import type { FormData, EstimateResponse, DriverOption } from '@/types/ride';
import { rideService } from '@/lib/api';
import { MapDisplay } from "./map-display";
import { ApiResponse } from "@/types/api";
import { cn } from "@/lib/utils";
import { useGoogleMap } from "@/hooks/use-google-maps";

export default function GoogleMapComponent() {
  const { clearRoute } = useGoogleMap()
  const [estimateResponse, setEstimateResponse] = useState<EstimateResponse | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    rides,
    availableDrivers,
    fetchRideHistory
  } = useRideHistory();

  const form = useForm<FormData>({
    resolver: zodResolver(rideFormSchema),
    defaultValues: {
      userId: '',
      origin: '',
      destination: '',
      driverId: undefined
    }
  });

  const handleEstimate = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await rideService.getEstimate({
        customer_id: data.userId,
        origin: data.origin,
        destination: data.destination,
      });


      setEstimateResponse(response as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRide = async () => {
    if (!selectedDriver || !estimateResponse) return;

    try {
      setIsLoading(true);
      setError(null);
      const formData = form.getValues();

      await rideService.confirmRide({
        customer_id: formData.userId,
        origin: formData.origin,
        destination: formData.destination,
        distance: estimateResponse.distance,
        duration: estimateResponse.duration,
        driver: {
          id: selectedDriver.id,
          name: selectedDriver.name,
        },
        value: selectedDriver.value,
      });

      clearRoute();
      setEstimateResponse(null);
      setSelectedDriver(null);
      fetchRideHistory(formData.userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverFilterChange = (driverId: string) => {
    const userId = form.getValues('userId');
    fetchRideHistory(userId, driverId);
  };

  const handleClearFilter = () => {
    const userId = form.getValues('userId');
    form.setValue('driverId', undefined);
    fetchRideHistory(userId);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-6 w-6" />
          Ride Service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs defaultValue="estimate" className="space-y-4">
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger disabled={isLoading} value="estimate" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  New Ride
                </TabsTrigger>
                <TabsTrigger disabled={isLoading} value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Ride History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="estimate" className="space-y-4">
                <RideForm
                  control={form.control}
                  isLoading={isLoading}
                  onSubmit={form.handleSubmit(handleEstimate)}
                />

                {error && (
                  <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
                    {error}
                  </div>
                )}

                {estimateResponse && (
                  <EstimateDetails
                    estimate={estimateResponse}
                    selectedDriver={selectedDriver}
                    isLoading={isLoading}
                    onDriverSelect={setSelectedDriver}
                    onConfirm={handleConfirmRide}
                  />
                )}
              </TabsContent>

              <TabsContent value="history">
                <RideHistory
                  rides={rides}
                  availableDrivers={availableDrivers}
                  isLoading={isLoading}
                  control={form.control}
                  onDriverFilterChange={handleDriverFilterChange}
                  onClearFilter={handleClearFilter}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:row-span-2">
            <MapDisplay
              routeResponse={estimateResponse}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
