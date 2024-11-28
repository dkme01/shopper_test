import { estimateRide } from '../../services/ride/estimate';
import { Request, Response } from 'express';

export const rideEstimation = async (req: Request, res: Response) => {
  try {
    const { customer_id, origin, destination } = req.body;

    const estimate = await estimateRide({
      customer_id,
      origin,
      destination
    });

    res.status(200).json(estimate);
  } catch (error) {
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
