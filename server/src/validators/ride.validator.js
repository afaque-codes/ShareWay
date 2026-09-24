import { z } from 'zod';

export const createRideSchema = z.object({
  originAddress: z
    .string({ required_error: 'Origin address is required.' })
    .min(3, 'Origin address must be at least 3 characters.'),
  originCoords: z
    .array(z.number())
    .length(2, 'Origin coordinates must be [longitude, latitude].')
    .optional(),
  destinationAddress: z
    .string({ required_error: 'Destination address is required.' })
    .min(3, 'Destination address must be at least 3 characters.'),
  destinationCoords: z
    .array(z.number())
    .length(2, 'Destination coordinates must be [longitude, latitude].')
    .optional(),
  departureTime: z
    .string({ required_error: 'Departure date & time is required.' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid departure date/time format.',
    }),
  totalSeats: z
    .number({ required_error: 'Total seats count is required.' })
    .int('Total seats must be an integer.')
    .min(1, 'Minimum 1 seat required.')
    .max(8, 'Maximum 8 seats allowed.'),
  pricePerSeat: z
    .number({ required_error: 'Price per seat is required.' })
    .min(0, 'Price per seat cannot be negative.')
    .max(10000, 'Price per seat cannot exceed ₹10,000.'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
});

export const routePreviewSchema = z.object({
  originAddress: z.string().min(2),
  destinationAddress: z.string().min(2),
  originCoords: z.array(z.number()).length(2).optional(),
  destinationCoords: z.array(z.number()).length(2).optional(),
});
