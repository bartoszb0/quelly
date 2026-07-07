import z from "zod";

export const loginSchema = z.object({
  email: z.email("auth:validation.emailInvalid").trim(),
  password: z
    .string()
    .trim()
    .min(6, "auth:validation.passwordMin")
    .max(24, "auth:validation.passwordMax"),
});

export type LoginInput = z.infer<typeof loginSchema>;
