import { Card } from "@/components/ui/card";
import { ORDER_STATUS_STYLE } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/Order";
import { useTranslation } from "react-i18next";

export default function OrderCard({ order }: { order: Order }) {
  const { t } = useTranslation();

  return (
    <Card className="gap-3 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-medium">#{order.number}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            ORDER_STATUS_STYLE[order.status],
          )}
        >
          {t(`status.${order.status}`)}
        </span>
      </div>

      {order.items.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 text-muted-foreground"
            >
              <span>{item.nameSnapshot}</span>
              <span className="tabular-nums">×{item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
