import { z } from "zod";

const uuidSchema = z.uuid();

export const isValidUuid = (value: string) =>
  uuidSchema.safeParse(value).success;
