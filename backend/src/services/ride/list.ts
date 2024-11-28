import { database } from "../../config/database";
import { Ride } from "../../models/ride";

const validateRequest = (customerId?: string): void => {
  if (!customerId || customerId.trim() === '') {
    throw new Error('Customer ID cannot be blank');
  }
};

export function findRidesByCustomerId(customerId: string, driverId?: string): Ride[] {
  validateRequest(customerId)

  const rides = database.prepare('SELECT * FROM rides WHERE customer_id = ?').all(customerId);
  const ridesList = rides.map((ride: any) => ({
    customer_id: ride.customer_id,
    origin: ride.origin,
    destination: ride.destination,
    date: ride.date,
    distance: ride.distance,
    duration: ride.duration,
    driver: {
      id: ride.driver_id,
      name: ride.driver_name,
    },
    value: ride.value
  }))
  console.log(ridesList)
  return driverId ? ridesList.filter((ride) => ride.driver?.id === driverId) : ridesList;
}
