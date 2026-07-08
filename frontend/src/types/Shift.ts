import type { Order } from "./Order";
import type { OffsetPagination } from "./Pagination";

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
  meta: OffsetPagination;
};

export type ShiftDetail = Shift & {
  orders: Order[];
};

export type ActiveShift = {
  id: string;
  startedAt: string;
};
