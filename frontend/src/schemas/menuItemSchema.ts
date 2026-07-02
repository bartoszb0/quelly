import z from "zod";

export const menuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(32, "Name is too long"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
