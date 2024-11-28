import { Request, Response } from 'express';
import { saveRide } from '../../services/ride/confirm';
import { RideConfirmRequest } from '../../types/ride';

export const confirmRide = async (req: Request, res: Response) => {
  try {
    const rideRequest: RideConfirmRequest = req.body;

    await saveRide(rideRequest);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error confirming ride:', error);
    if (error instanceof Error) {
      res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: error.message
      });
    } else {
      res.status(500).json({
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'An unexpected error occurred'
      });
    }
  }
};
