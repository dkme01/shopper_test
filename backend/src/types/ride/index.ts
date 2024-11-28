import { Ride } from "../../models/ride";
import { Driver } from "../../models/driver";

export interface RideEstimateRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RideEstimateResponse {
  origin: Coordinates;
  destination: Coordinates;
  distance: number;
  duration: string;
  options: Driver[];
  routeResponse: any;
}

export interface RideConfirmRequest extends Ride { }
