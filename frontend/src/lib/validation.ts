import * as z from 'zod';

export const rideFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  driverId: z.string().optional()
});

export type RideFormType = z.infer<typeof rideFormSchema>
