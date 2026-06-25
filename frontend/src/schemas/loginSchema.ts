import z from "zod";

export const loginSchema = z.object({
  email: z.email().trim(),
  password: z.string().trim().min(1).max(24),
});

export type LoginInput = z.infer<typeof loginSchema>;
