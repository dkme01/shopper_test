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
  origin: Coordinates;
  destination: Coordinates;
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

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  legs: Leg[];
  warnings: any[];
  optimizedIntermediateWaypointIndex: any[];
  routeLabels: string[];
  distanceMeters: number;
  duration: Duration;
  staticDuration: Duration;
  polyline: Polyline;
  description: string;
  viewport: Viewport;
  travelAdvisory: TravelAdvisory;
  localizedValues: LegLocalizedValues;
  routeToken: string;
}

export interface Duration {
  seconds: string;
  nanos: number;
}

export interface Leg {
  steps: Step[];
  distanceMeters: number;
  duration: Duration;
  staticDuration: Duration;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  travelAdvisory: null;
  localizedValues: LegLocalizedValues;
  stepsOverview: null;
}

export interface Location {
  latLng: High;
  heading: null;
}

export interface High {
  latitude: number;
  longitude: number;
}

export interface LegLocalizedValues {
  distance: Distance;
  duration: Distance;
  staticDuration: Distance;
  transitFare?: null;
}

export interface Distance {
  text: string;
  languageCode: string;
}

export interface Polyline {
  encodedPolyline: string;
  polylineType: PolylineType;
}

export enum PolylineType {
  EncodedPolyline = "encodedPolyline",
}

export interface Step {
  distanceMeters: number;
  staticDuration: Duration;
  polyline: Polyline;
  startLocation: Location;
  endLocation: Location;
  navigationInstruction: NavigationInstruction;
  travelAdvisory: null;
  localizedValues: StepLocalizedValues;
  transitDetails: null;
  travelMode: TravelMode;
}

export interface StepLocalizedValues {
  distance: Distance;
  staticDuration: Distance;
}

export interface NavigationInstruction {
  maneuver: string;
  instructions: string;
}

export enum TravelMode {
  Drive = "DRIVE",
}

export interface TravelAdvisory {
  speedReadingIntervals: any[];
  tollInfo: null;
  fuelConsumptionMicroliters: string;
  routeRestrictionsPartiallyIgnored: boolean;
  transitFare: null;
}

export interface Viewport {
  low: High;
  high: High;
}
