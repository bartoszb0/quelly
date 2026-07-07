import type { Order } from "./Order";
import type { Pagination } from "./Pagination";

export type Shift = {
  id: string;
  shopId: string;
  startedAt: string;
  endedAt: string | null;
};

export type ShiftListItem = Shift & {
  ordersCount: number;
};

export type ShiftsPaginated = {
  shifts: ShiftListItem[];
  meta: Pagination;
};

export type ShiftDetail = Shift & {
  orders: Order[];
};

export type ActiveShift = {
  id: string;
  startedAt: string;
};
