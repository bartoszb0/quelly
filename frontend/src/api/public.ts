import type { GuestOrder } from "@/types/GuestOrder";
import type { GuestShop } from "@/types/GuestShop";
import { api } from "./client";

export const getShop = async (shopPublicId: string): Promise<GuestShop> => {
  const res = await api.get<GuestShop>(`/public/shops/${shopPublicId}`);
  return res.data;
};

export const getOrder = async (
  shopPublicId: string,
  orderNumber: string,
): Promise<GuestOrder> => {
  const res = await api.get<GuestOrder>(
    `/public/shops/${shopPublicId}/orders/${orderNumber}`,
  );
  return res.data;
};
