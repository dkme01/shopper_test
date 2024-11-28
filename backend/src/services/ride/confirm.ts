import { database } from "../../config/database";
import { RideConfirmRequest } from "../../types/ride";

export const validateRideRequest = (
  request: RideConfirmRequest,
) => {

  if (!request.origin || request.origin.trim() === '') {
    throw new Error('Origin address cannot be blank');
  }

  if (!request.destination || request.destination.trim() === '') {
    throw new Error('Destination address cannot be blank');
  }

  if (request.origin.trim() === request.destination.trim()) {
    throw new Error('Origin and destination cannot be the same address');
  }

  if (!request.customer_id || request.customer_id.trim() === '') {
    throw new Error('Customer ID cannot be blank');
  }

  if (!request.driver || !request.driver.id || !request.driver.name) {
    throw new Error('Driver information is invalid')
  };
};

export const saveRide = async (rideRequest: RideConfirmRequest): Promise<boolean> => {
  console.log('Saving ride:', rideRequest);

  validateRideRequest(rideRequest);

  const insertRide = database.prepare(`
  INSERT INTO rides (
    customer_id, origin, destination,
    distance, duration, driver_id,
    driver_name, value, date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

  insertRide.run(
    rideRequest.customer_id,
    rideRequest.origin,
    rideRequest.destination,
    rideRequest.distance,
    rideRequest.duration,
    rideRequest.driver.id,
    rideRequest.driver.name,
    rideRequest.value,
    new Date().toISOString()
  );

  return true;
};
