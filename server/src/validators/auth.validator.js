import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .max(255, 'Email cannot exceed 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(/[A-Za-z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters'),
  role: z.enum(['PASSENGER', 'DRIVER']).default('PASSENGER'),
  phone: z.string().trim().optional(),
  // If driver, optional initial license number
  licenseNumber: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address format'),
  password: z
    .string()
    .min(1, 'Password is required'),
  expectedRole: z.enum(['PASSENGER', 'DRIVER', 'ADMIN']).optional(),
});
