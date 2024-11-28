export interface DriverOption {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review_rating: number;
  review_comment: string;
  value: number;
}

export interface EstimateResponse {
  origin: RoutePoint;
  destination: RoutePoint;
  distance: number;
  duration: string;
  options: DriverOption[];
  routeResponse: RouteResponse[];
}

export interface Driver {
  id: number;
  name: string;
}

export interface Ride {
  id: number;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: Driver;
  value: number;
}

export interface FormData {
  userId: string;
  origin: string;
  destination: string;
  driverId?: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface RouteResponse {
  points: RoutePoint[];
  encodedPolyline: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

