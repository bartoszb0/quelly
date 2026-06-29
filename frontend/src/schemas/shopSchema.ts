import z from "zod";

export const shopSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(32, "Name is too long"),
});

export type ShopInput = z.infer<typeof shopSchema>;
