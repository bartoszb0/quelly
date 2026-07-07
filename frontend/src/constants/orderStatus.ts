import type { OrderStatus } from "@/types/OrderStatus";

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  QUEUED: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  READY: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  COLLECTED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-destructive/10 text-destructive",
};
