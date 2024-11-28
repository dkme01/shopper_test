export interface Ride {
  customer_id: string;
  origin: string;
  destination: string;
  date: Date | string;
  distance: number;
  duration: string;
  driver: {
    id: string;
    name: string;
  };
  value: number;
}
