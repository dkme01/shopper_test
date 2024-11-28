import { useState, useCallback, useRef } from 'react';
import type { RoutePoint, RouteResponse } from '@/types/ride';

export function useGoogleMap() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const clearRoute = useCallback(() => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const displayRoute = useCallback((routeResponse: RouteResponse[] | undefined) => {
    if (!map || !routeResponse) return;

    console.log('routeResponse', routeResponse)

    // Clear existing route
    clearRoute();

    const polylineDecoded = google.maps.geometry.encoding.decodePath(routeResponse[0].encodedPolyline)

    // Create and display the polyline
    const polyline = new google.maps.Polyline({
      path: polylineDecoded,
      geodesic: true,
      strokeColor: '#4F46E5',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    polyline.setMap(map);
    polylineRef.current = polyline;

    // Create markers for origin and destination
    if (routeResponse[0].points.length >= 2) {
      const origin = routeResponse[0].points[0];
      const destination = routeResponse[0].points[routeResponse[0].points.length - 1];


      // Origin marker
      const originMarker = new google.maps.Marker({
        position: origin,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4F46E5',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Origin',
      });

      // Destination marker
      const destinationMarker = new google.maps.Marker({
        position: destination,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#E11D48',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: 'Destination',
      });

      markersRef.current = [originMarker, destinationMarker];

      // Fit bounds to show the entire route
      const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          routeResponse[0].bounds.south,
          routeResponse[0].bounds.west
        ),
        new google.maps.LatLng(
          routeResponse[0].bounds.north,
          routeResponse[0].bounds.east
        )
      );

      map.fitBounds(bounds,
        { top: 50, right: 50, bottom: 50, left: 50 }
      );
    }
  }, [map, clearRoute]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    clearRoute();
    setMap(null);
  }, [clearRoute]);

  return {
    map,
    onLoad,
    onUnmount,
    displayRoute,
    clearRoute,
  };
}

