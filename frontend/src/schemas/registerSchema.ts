import z from "zod";

export const registerSchema = z
  .object({
    email: z.email("Please enter a valid email address").trim(),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters")
      .max(24, "Password can't be longer than 24 characters"),
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
