import { z } from 'zod';

export const $registerRequest = z.object({
  email: z.email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});
export const $registerResponse = z.object({
  id: z.uuid(),
  email: z.email('Invalid email format').toLowerCase(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $loginRequest = z.object({
  email: z.email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});
export const $loginResponse = z.object({
  type: z.literal('Bearer'),
  token: z.string().min(1, 'Token is required'),
});
export type RegisterRequest = z.infer<typeof $registerRequest>;
export type RegisterResponse = z.infer<typeof $registerResponse>;

export type LoginRequest = z.infer<typeof $loginRequest>;
export type LoginResponse = z.infer<typeof $loginResponse>;
