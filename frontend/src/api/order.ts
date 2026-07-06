import type { Order } from "@/types/Order";
import { api } from "./client";

export type CreateOrderBody = {
  items: { menuItemId: string; quantity: number }[];
};

export const createOrder = async (
  shopId: string,
  body: CreateOrderBody,
): Promise<Order> => {
  const res = await api.post<Order>(`/shops/${shopId}/orders`, body);
  return res.data;
};

export const markOrderReady = async (
  shopId: string,
  id: string,
): Promise<Order> => {
  const res = await api.post<Order>(`/shops/${shopId}/orders/${id}/ready`);
  return res.data;
};

export const markOrderCollected = async (
  shopId: string,
  id: string,
): Promise<Order> => {
  const res = await api.post<Order>(`/shops/${shopId}/orders/${id}/collected`);
  return res.data;
};

export const markOrderCancelled = async (
  shopId: string,
  id: string,
): Promise<Order> => {
  const res = await api.post<Order>(`/shops/${shopId}/orders/${id}/cancelled`);
  return res.data;
};
