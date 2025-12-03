import { z } from "zod";

export const $register = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

export type Register = z.infer<typeof $register>;
