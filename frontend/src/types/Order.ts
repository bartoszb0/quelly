import type { OrderStatus } from "./OrderStatus";

export type Order = {
  id: string;
  shopId: string;
  shiftId: string;
  number: number;
  status: OrderStatus;
  createdAt: string;
  readyAt: string;
  collectedAt: string;
};
