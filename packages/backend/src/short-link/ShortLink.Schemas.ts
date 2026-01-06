import { $user } from "@/user/User.Schemas";
import { z } from "zod";

export const $shortLink = z.object({
  id: z.uuid(),
  version: z.number().default(1),
  userId: $user.shape.id,
  title: z.string().min(1).max(20),
  shortCode: z.string().length(6),
  originalUrl: z.url(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $newShortLink = $shortLink.omit({
  id: true,
  version: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const $pagination = z.object({
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  nextToken: z.string().optional(),
});

export type ShortLink = z.infer<typeof $shortLink>;
export type NewShortLink = z.infer<typeof $newShortLink>;
export type Pagination = z.infer<typeof $pagination>;
