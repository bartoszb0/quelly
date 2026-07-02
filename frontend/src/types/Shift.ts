import type { Order } from "./Order";

export type Shift = {
  id: string;
  shopId: string;
  startedAt: string;
  endedAt: string | null;
};

export type ShiftListItem = Shift & {
  ordersCount: number;
};

export type ShiftDetail = Shift & {
  orders: Order[];
};
