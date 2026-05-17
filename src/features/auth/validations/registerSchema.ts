import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),

  fullName: z
    .string()
    .min(2, 'Full name is required'),
});

export type RegisterFormData =
  z.infer<typeof registerSchema>;