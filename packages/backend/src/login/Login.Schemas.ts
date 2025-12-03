import { z } from "zod";

export const $login = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

export type Login = z.infer<typeof $login>;
