import { api } from "./client";

export const getShops = async () => {
  const res = await api.get("/shops");
  return res.data;
};

export const getShop = async (shopId: string) => {
  const res = await api.get(`/shops/${shopId}`);
  return res.data;
};
