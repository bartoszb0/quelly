import type { ShiftDetail, ShiftListItem } from "@/types/Shift";
import { api } from "./client";

export const getShifts = async (
  shopId: string,
): Promise<ShiftListItem[]> => {
  const res = await api.get<ShiftListItem[]>(`/shops/${shopId}/shifts`);
  return res.data;
};

export const getShift = async (
  shopId: string,
  shiftId: string,
): Promise<ShiftDetail> => {
  const res = await api.get<ShiftDetail>(`/shops/${shopId}/shifts/${shiftId}`);
  return res.data;
};
