import axios from 'axios';
import type {
  ApiResponse,
  EstimateRequest,
  ConfirmRideRequest,
  RideHistoryResponse,
  EstimateApiResponse
} from '@/types/api';

const api = axios.create({
  baseURL: process.env.BACKEND_API_URL as string || 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error_description || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export const rideService = {
  async getRideHistory(userId: string, driverId?: string): Promise<RideHistoryResponse & { error_description: string }> {
    const url = driverId ? `/ride/${userId}?driver_id=${driverId}` : `/ride/${userId}`;
    const response = await api.get<RideHistoryResponse>(url);
    return { ...response.data, error_description: '' };
  },

  async getEstimate(data: EstimateRequest): Promise<EstimateApiResponse & { error_description: string }> {
    const response = await api.post<EstimateApiResponse>('/ride/estimate', data);
    return { ...response.data, error_description: '' };
  },

  async confirmRide(data: ConfirmRideRequest): Promise<void> {
    await api.patch<ApiResponse<void>>('/ride/confirm', data);
  },
};
