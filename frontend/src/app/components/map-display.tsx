import { useGoogleMap } from '@/hooks/use-google-maps';
import { MAP_CONFIG } from '@/lib/constants';
import type { EstimateResponse } from '@/types/ride';
import { GoogleMap } from '@react-google-maps/api';
import { useEffect } from 'react';

interface MapDisplayProps {
  routeResponse: EstimateResponse | null;
}

export function MapDisplay({ routeResponse }: MapDisplayProps) {
  const { onLoad, onUnmount, displayRoute } = useGoogleMap();

  useEffect(() => {
    displayRoute(routeResponse);
  }, [routeResponse, displayRoute]);

  return (
    <div className="rounded-lg overflow-hidden border">
      <GoogleMap
        mapContainerStyle={MAP_CONFIG.defaultMapContainerStyle}
        zoom={MAP_CONFIG.defaultMapZoom}
        center={MAP_CONFIG.defaultMapCenter}
        options={{
          zoomControl: true,
          tilt: 0,
          gestureHandling: 'cooperative',
          streetViewControl: false,
          mapTypeControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      />
    </div>
  );
}

