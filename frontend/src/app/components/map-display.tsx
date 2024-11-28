import { GoogleMap } from '@react-google-maps/api';
import { useEffect } from 'react';
import { useGoogleMap } from '@/hooks/use-google-maps';
import { MAP_CONFIG } from '@/lib/constants';
import type { RouteResponse } from '@/types/ride';

interface MapDisplayProps {
  routeResponse?: RouteResponse[];
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

