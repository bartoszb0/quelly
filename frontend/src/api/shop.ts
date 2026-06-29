import type { ShopInput } from "@/schemas/shopSchema";
import type { Shop } from "@/types/Shop";
import { api } from "./client";

export const getShops = async (): Promise<Shop[]> => {
  const res = await api.get<Shop[]>("/shops");
  return res.data;
};

export const getShop = async (shopId: string): Promise<Shop> => {
  const res = await api.get<Shop>(`/shops/${shopId}`);
  return res.data;
};

export const createShop = async (body: ShopInput) => {
  const res = await api.post("/shops", body);
  return res.data;
};

export const getQrCode = async (shopId: string): Promise<Blob> => {
  const res = await api.get<Blob>(`/shops/${shopId}/qr`, {
    responseType: "blob",
  });
  return res.data;
};
