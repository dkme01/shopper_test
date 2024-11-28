import { Driver } from '../../models/driver';
import { Client } from '@googlemaps/google-maps-services-js';
import { RoutesClient } from '@googlemaps/routing';
import {
  RideEstimateRequest,
  RideEstimateResponse,
  RouteResponse,
  RoutePoint,
} from '../../types/ride';
import { listDrivers } from './drivers';

const validateRequest = (request: RideEstimateRequest): void => {
  if (!request.customer_id || request.customer_id.trim() === '') {
    throw new Error('Customer ID cannot be blank');
  }

  if (!request.origin || request.origin.trim() === '') {
    throw new Error('Origin address cannot be blank');
  }

  if (!request.destination || request.destination.trim() === '') {
    throw new Error('Destination address cannot be blank');
  }

  if (request.origin.trim() === request.destination.trim()) {
    throw new Error('Origin and destination cannot be the same address');
  }
};

const geocodeAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number }> => {
  try {
    const client = new Client({
      config: {
        headers: {
          'X-Goog-Api-Key': process.env.GOOGLE_API_KEY || "",
          "Content-Type": "application/json",
          'X-Goog-FieldMask': "*",
        }
      }
    })
    const response = await client.geocode({
      params: {
        address,
        key: process.env.GOOGLE_API_KEY || '',
      }
    });

    const location = response.data.results[0].geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Failed to geocode address: ${address}`);
  }
};

const calculateRoute = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) => {
  try {
    const client = new RoutesClient({
      apiKey: process.env.GOOGLE_API_KEY || '',
    })
    const response = await client.computeRoutes({
      origin: {
        location: {
          latLng: {
            latitude: origin.latitude,
            longitude: origin.longitude
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.latitude,
            longitude: destination.longitude
          }
        }
      },
      travelMode: 'DRIVE',
      routingPreference: "TRAFFIC_AWARE_OPTIMAL",
      computeAlternativeRoutes: false,
      languageCode: 'pt-BR',
      units: 'METRIC',
      polylineEncoding: 'ENCODED_POLYLINE',
    }, {
      otherArgs: {
        headers: {
          "Content-Type": "application/json",
          'X-Goog-FieldMask': "*",
        }
      }
    });

    await client.close();

    console.log('calculateRoute', response[0].routes)

    return response[0].routes;
  } catch (error) {
    console.error('Route calculation error:', error);
    throw new Error('Failed to calculate route');
  }
};

const calculateDriverOptions = (distance: number): Driver[] => {
  const availableDrivers = listDrivers(distance);
  console.log(availableDrivers)

  return availableDrivers
    .filter(driver => distance >= driver.minimum_km)
    .map(driver => ({
      id: driver.id,
      name: driver.name,
      description: driver.description,
      vehicle: driver.vehicle,
      review_rating: driver.review_rating,
      review_comment: driver.review_comment,
      rate_per_km: driver.rate_per_km,
      minimum_km: driver.minimum_km,
      value: Number((distance * driver.rate_per_km).toFixed(2))
    }))
    .sort((a, b) => a.value - b.value);
};

const transformRouteToMapFormat = (routes: any[]): RouteResponse[] => {
  if (!routes || routes.length === 0) return [];

  const route = routes[0];

  console.log('transformRouteToMapFormat', route)

  // Transform polyline to lat/lng points
  const points: RoutePoint[] = route.polyline.geoJsonLinestring.map((point: { latitude: number; longitude: number }) => ({
    lat: point.latitude,
    lng: point.longitude
  }));

  // Calculate bounds
  const bounds = {
    north: Math.max(...points.map(p => p.lat)),
    south: Math.min(...points.map(p => p.lat)),
    east: Math.max(...points.map(p => p.lng)),
    west: Math.min(...points.map(p => p.lng))
  };

  return [{
    points,
    bounds,
    distance: route.distanceMeters / 1000, // convert to kilometers
    duration: route.duration || '0s'
  }];
};

export const estimateRide = async (
  request: RideEstimateRequest,
): Promise<RideEstimateResponse> => {

  validateRequest(request);

  const originCoords = await geocodeAddress(request.origin);
  const destinationCoords = await geocodeAddress(request.destination);

  const routeResponse = await calculateRoute(
    originCoords,
    destinationCoords
  );
  const transformedRouteResponse = transformRouteToMapFormat(routeResponse as any);

  const routeDistance = transformedRouteResponse[0].distance || 0;

  const duration = transformedRouteResponse[0].duration || '0s';

  const driverOptions = calculateDriverOptions(routeDistance);


  return {
    origin: originCoords,
    destination: destinationCoords,
    distance: routeDistance,
    duration: duration,
    options: driverOptions,
    routeResponse
  };
};