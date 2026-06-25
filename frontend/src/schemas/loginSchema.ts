import z from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .max(24, "Password can't be longer than 24 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
