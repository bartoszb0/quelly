import { api } from "./client";

export const getShop = async (shopPublicId: string) => {
  const res = await api.get(`/public/shops/${shopPublicId}`);
  return res.data;
};
