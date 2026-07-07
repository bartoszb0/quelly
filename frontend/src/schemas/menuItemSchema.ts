import z from "zod";

export const menuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "common:validation.nameRequired")
    .max(32, "common:validation.nameTooLong"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
