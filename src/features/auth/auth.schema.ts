import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "name obrigatorio"),
  email: z.string().email("email invalido"),
  password: z.string().min(6, "password deve ter ao menos 6 caracteres")
});

export const loginSchema = z.object({
  email: z.string().email("email invalido"),
  password: z.string().min(1, "password obrigatorio")
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
