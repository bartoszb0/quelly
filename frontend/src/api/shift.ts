import type { Shift, ShiftDetail, ShiftsPaginated } from "@/types/Shift";
import { api } from "./client";

export const getShifts = async (
  shopId: string,
  page: number,
): Promise<ShiftsPaginated> => {
  const res = await api.get<ShiftsPaginated>(
    `/shops/${shopId}/shifts?page=${page}`,
  );
  return res.data;
};

export const getShift = async (
  shopId: string,
  shiftId: string,
): Promise<ShiftDetail> => {
  const res = await api.get<ShiftDetail>(`/shops/${shopId}/shifts/${shiftId}`);
  return res.data;
};

export const startShift = async (shopId: string): Promise<Shift> => {
  const res = await api.post<Shift>(`/shops/${shopId}/shifts/start`);
  return res.data;
};

export const endShift = async (shopId: string): Promise<Shift> => {
  const res = await api.post<Shift>(`/shops/${shopId}/shifts/end`);
  return res.data;
};
