import z from "zod";

export const shopSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "common:validation.nameRequired")
    .max(32, "common:validation.nameTooLong"),
});

export type ShopInput = z.infer<typeof shopSchema>;
