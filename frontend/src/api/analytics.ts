import type { Analytics } from "@/types/Analytics";
import { api } from "./client";

export const getAnalytics = async (shopId: string): Promise<Analytics> => {
  const res = await api.get<Analytics>(`/shops/${shopId}/analytics`);
  return res.data;
};
