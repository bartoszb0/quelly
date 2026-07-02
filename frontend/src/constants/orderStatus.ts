import type { OrderStatus } from "@/types/OrderStatus";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  QUEUED: "Queued",
  READY: "Ready",
  COLLECTED: "Collected",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  QUEUED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  READY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COLLECTED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};
