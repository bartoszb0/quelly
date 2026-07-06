import { ORDER_STATUS_STYLE } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/OrderStatus";
import {
  Ban,
  BellRing,
  Hourglass,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const STATUS_ICON: Record<OrderStatus, LucideIcon> = {
  QUEUED: Hourglass,
  READY: BellRing,
  COLLECTED: UtensilsCrossed,
  CANCELLED: Ban,
};

export default function OrderStatusIcon({ status }: { status: OrderStatus }) {
  const Icon = STATUS_ICON[status];

  return (
    <div className="relative">
      {/* Attention ping once the order is ready for pickup. */}
      {status === "READY" && (
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
      )}
      <div
        className={cn(
          "relative flex size-20 items-center justify-center rounded-full",
          ORDER_STATUS_STYLE[status],
        )}
      >
        <Icon
          className={cn("size-9", status === "QUEUED" && "animate-pulse")}
        />
      </div>
    </div>
  );
}
