import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
} from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/OrderStatus";

function statusMessage(status: OrderStatus, ordersInQueue: number | null) {
  switch (status) {
    case "QUEUED":
      if (ordersInQueue === null) return "You're in the queue.";
      return ordersInQueue === 0
        ? "You're next in line!"
        : `${ordersInQueue} ${ordersInQueue === 1 ? "order" : "orders"} ahead of you.`;
    case "READY":
      return "Your order is ready — come pick it up!";
    case "COLLECTED":
      return "Picked up. Enjoy!";
    case "CANCELLED":
      return "This order was cancelled.";
  }
}

export default function OrderStatusMessage({
  status,
  ordersInQueue,
}: {
  status: OrderStatus;
  ordersInQueue: number | null;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className={cn(
          "rounded-full px-3 py-1 text-sm font-medium",
          ORDER_STATUS_STYLE[status],
        )}
      >
        {ORDER_STATUS_LABEL[status]}
      </span>
      <p className="text-center text-base">
        {statusMessage(status, ordersInQueue)}
      </p>
    </div>
  );
}
