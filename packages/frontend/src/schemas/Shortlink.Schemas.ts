import { z } from 'zod';
import { $user } from 'src/schemas/User.Schemas';

export const $shortlink = z.object({
  id: z.uuid(),
  version: z.number().default(1),
  userId: $user.shape.id,
  title: z.string().min(1).max(20),
  shortCode: z.string().length(6),
  originalUrl: z.url(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $newShortlink = $shortlink.omit({
  id: true,
  version: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type Shortlink = z.infer<typeof $shortlink>;
export type NewShortlink = z.infer<typeof $newShortlink>;
