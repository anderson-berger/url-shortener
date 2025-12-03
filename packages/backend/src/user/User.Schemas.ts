import { z } from "zod";

export const $user = z.object({
  id: z.uuid(),
  email: z.email().toLowerCase(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const $newUser = $user.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  datetime: true,
});

export type User = z.infer<typeof $user>;
export type NewUser = z.infer<typeof $newUser>;
