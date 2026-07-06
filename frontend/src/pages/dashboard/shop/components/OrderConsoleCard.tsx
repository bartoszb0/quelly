import {
  markOrderCancelled,
  markOrderCollected,
  markOrderReady,
} from "@/api/order";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
} from "@/constants/orderStatus";
import { toastApiError } from "@/lib/toastApiError";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/Order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, X } from "lucide-react";
import { useState } from "react";

export default function OrderConsoleCard({
  order,
  shopId,
  shiftId,
}: {
  order: Order;
  shopId: string;
  shiftId: string;
}) {
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["shift", shopId, shiftId] });

  const ready = useMutation({
    mutationFn: () => markOrderReady(shopId, order.id),
    onSuccess: invalidate,
    onError: (e) => toastApiError(e),
  });

  const collected = useMutation({
    mutationFn: () => markOrderCollected(shopId, order.id),
    onSuccess: invalidate,
    onError: (e) => toastApiError(e),
  });

  const cancelled = useMutation({
    mutationFn: () => markOrderCancelled(shopId, order.id),
    onSuccess: invalidate,
    onError: (e) => toastApiError(e),
  });

  const busy = ready.isPending || collected.isPending || cancelled.isPending;
  const isTerminal =
    order.status === "COLLECTED" || order.status === "CANCELLED";

  // First click arms the cancel; the second actually cancels the order.
  const handleCancel = () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    cancelled.mutate();
  };

  return (
    <Card className={cn("gap-3 p-4", isTerminal && "opacity-60")}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-medium">#{order.number}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            ORDER_STATUS_STYLE[order.status],
          )}
        >
          {ORDER_STATUS_LABEL[order.status]}
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

      {!isTerminal && (
        <div className="flex items-center gap-2">
          {order.status === "QUEUED" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => ready.mutate()}
              disabled={busy}
            >
              <Check />
              Ready
            </Button>
          )}

          {order.status === "READY" && (
            <Button
              size="sm"
              className="flex-1"
              onClick={() => collected.mutate()}
              disabled={busy}
            >
              <CheckCheck />
              Collected
            </Button>
          )}

          <Button
            size="sm"
            variant="destructive"
            className={cn(
              confirmCancel && "bg-destructive text-white hover:bg-destructive/90",
            )}
            onClick={handleCancel}
            disabled={busy}
          >
            <X />
            {cancelled.isPending
              ? "Cancelling..."
              : confirmCancel
                ? "Confirm"
                : "Cancel"}
          </Button>
        </div>
      )}
    </Card>
  );
}
