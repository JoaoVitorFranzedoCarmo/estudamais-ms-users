import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional()
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
