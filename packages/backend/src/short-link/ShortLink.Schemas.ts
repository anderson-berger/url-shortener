import { z } from "zod";

export const $shortLink = z.object({
  id: z.uuid(),
  version: z.number().default(1),
  shortCode: z.string().length(6),
  originalUrl: z.url(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $newShortLink = $shortLink.omit({
  id: true,
  version: true,
  shortCode: true,
  createdAt: true,
  updatedAt: true,
});

export type ShortLink = z.infer<typeof $shortLink>;
export type NewShortLink = z.infer<typeof $newShortLink>;
