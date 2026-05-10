import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email("Email inválido"),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6),
});
