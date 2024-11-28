import type { DriverOption, EstimateResponse, Ride } from './ride';

export interface ApiResponse<T> {
  data: T;
  error_description?: string;
}

export interface EstimateRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface ConfirmRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

export interface RideHistoryResponse {
  rides: Ride[];
}

export interface EstimateApiResponse {
  data: EstimateResponse;
}
