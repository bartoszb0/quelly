import z from "zod";

export const registerSchema = z
  .object({
    email: z.email("auth:validation.emailInvalid").trim(),
    password: z
      .string()
      .trim()
      .min(6, "auth:validation.passwordMin")
      .max(24, "auth:validation.passwordMax"),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "auth:validation.confirmRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "auth:validation.passwordsMismatch",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
