import { api } from "./client";

export const getMenuItems = async (shopId: string) => {
  const res = await api.get(`/shops/${shopId}/menu-items`);
  return res.data;
};
