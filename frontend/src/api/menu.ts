import type { MenuItemInput } from "@/schemas/menuItemSchema";
import type { MenuItem } from "@/types/MenuItem";
import { api } from "./client";

export const getMenuItems = async (shopId: string): Promise<MenuItem[]> => {
  const res = await api.get<MenuItem[]>(`/shops/${shopId}/menu-items`);
  return res.data;
};

export const createMenuItem = async (
  shopId: string,
  body: MenuItemInput,
): Promise<MenuItem> => {
  const res = await api.post<MenuItem>(`/shops/${shopId}/menu-items`, body);
  return res.data;
};
