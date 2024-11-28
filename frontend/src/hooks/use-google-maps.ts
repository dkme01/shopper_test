import type { EstimateResponse, RouteResponse } from '@/types/ride';
import { useCallback, useRef, useState } from 'react';

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

  const displayRoute = useCallback((routeResponse: EstimateResponse | null) => {
    if (!map || !routeResponse?.routeResponse) return;

    console.log('routeResponse', routeResponse)

    clearRoute();

    const polylineDecoded = google.maps.geometry.encoding.decodePath(routeResponse.routeResponse[0].polyline.encodedPolyline)

    const polyline = new google.maps.Polyline({
      path: polylineDecoded,
      geodesic: true,
      strokeColor: '#4F46E5',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    polyline.setMap(map);
    polylineRef.current = polyline;

    if (routeResponse.origin.latitude && routeResponse.destination.latitude) {
      const origin: google.maps.LatLngLiteral = {
        lat: routeResponse.origin.latitude,
        lng: routeResponse.origin.longitude
      }
      const destination: google.maps.LatLngLiteral = {
        lat: routeResponse.destination.latitude,
        lng: routeResponse.destination.longitude
      }


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

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(originMarker.getPosition() as google.maps.LatLng)
      bounds.extend(destinationMarker.getPosition() as google.maps.LatLng)

      const mapWidth = bounds.getSouthWest().lng() > bounds.getNorthEast().lng()
        ? (180 - bounds.getSouthWest().lng()) + (bounds.getNorthEast().lng() - (-180))
        : bounds.getSouthWest().lng() - bounds.getNorthEast().lng();

      bounds.extend(new google.maps.LatLng(bounds.getCenter().lat(), mapWidth))
      map.fitBounds(bounds);

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

