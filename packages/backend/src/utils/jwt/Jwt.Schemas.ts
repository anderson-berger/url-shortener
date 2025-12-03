import { $user } from "@/user/User.Schemas";
import z from "zod";

const $tokenPayload = z.object({
  userId: $user.shape.id,
  email: $user.shape.email,
});

export type TokenPayload = z.infer<typeof $tokenPayload>;
