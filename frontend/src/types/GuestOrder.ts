import type { OrderStatus } from "./OrderStatus";

export type GuestOrder = {
  number: number;
  ordersInQueue: number | null;
  status: OrderStatus;
  createdAt: string;
  items: GuestItem[];
};

type GuestItem = {
  nameSnapshot: string;
  quantity: number;
};
