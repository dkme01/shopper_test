export interface Driver {
  id: string;
  name: string;
  description: string;
  vehicle: string;
  review_rating: number;
  review_comment: string;
  rate_per_km: number;
  minimum_km: number;
}
