// auth_schema.ts
import { z } from "zod";

// Schema completo (o que está no banco)
export const $credential = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  passwordHash: z.string(), // ← hash no banco
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

// Schema para criar (o que recebe de input)
export const $newCredential = z.object({
  userId: z.uuid(),
  password: z.string().min(8),
});

export type Credential = z.infer<typeof $credential>;
export type NewCredential = z.infer<typeof $newCredential>;
