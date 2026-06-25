import z from "zod";

export const registerSchema = z
  .object({
    email: z.email().trim(),
    password: z.string().trim().min(1).max(24),
    confirmPassword: z.string().trim().min(1).max(24),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
