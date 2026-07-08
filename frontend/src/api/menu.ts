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

export const updateMenuItem = async (
  shopId: string,
  id: string,
  body: MenuItemInput,
): Promise<MenuItem> => {
  const res = await api.patch<MenuItem>(
    `/shops/${shopId}/menu-items/${id}`,
    body,
  );
  return res.data;
};

export const deleteMenuItem = async (
  shopId: string,
  id: string,
): Promise<void> => {
  await api.delete(`/shops/${shopId}/menu-items/${id}`);
};

export const reorderMenuItems = async (
  shopId: string,
  ids: string[],
): Promise<MenuItem[]> => {
  const res = await api.patch<MenuItem[]>(
    `/shops/${shopId}/menu-items/reorder`,
    { ids },
  );
  return res.data;
};
