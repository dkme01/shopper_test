import express from 'express';

import { confirmRide } from '../controllers/ride/confirm';
import { rideEstimation } from '../controllers/ride/estimate';
import { listAllRides } from '../controllers/ride/list';

const router = express.Router();

router.post('/estimate', rideEstimation)
router.patch('/confirm', confirmRide)
router.get('/:customer_id', listAllRides);

export default router;
