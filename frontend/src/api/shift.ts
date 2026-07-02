import type { Shift } from "@/types/Shift";
import { api } from "./client";

export const getShifts = async (shopId: string): Promise<Shift[]> => {
  const res = await api.get<Shift[]>(`/shops/${shopId}/shifts`);
  return res.data;
};

export const getShift = async (shopId: string, shiftId: string) => {
  const res = await api.get(`shops/${shopId}/shifts/${shiftId}`);
  return res.data;
};
