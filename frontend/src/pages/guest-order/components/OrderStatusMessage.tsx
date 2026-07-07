import { ORDER_STATUS_STYLE } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/OrderStatus";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

function statusMessage(
  t: TFunction<"guest">,
  status: OrderStatus,
  ordersInQueue: number | null,
) {
  switch (status) {
    case "QUEUED":
      if (ordersInQueue === null) return t("message.inQueue");
      return ordersInQueue === 0
        ? t("message.nextInLine")
        : t("message.aheadOfYou", { count: ordersInQueue });
    case "READY":
      return t("message.ready");
    case "COLLECTED":
      return t("message.collected");
    case "CANCELLED":
      return t("message.cancelled");
  }
}

export default function OrderStatusMessage({
  status,
  ordersInQueue,
}: {
  status: OrderStatus;
  ordersInQueue: number | null;
}) {
  const { t } = useTranslation("guest");

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className={cn(
          "rounded-full px-3 py-1 text-sm font-medium",
          ORDER_STATUS_STYLE[status],
        )}
      >
        {t(`common:status.${status}`)}
      </span>
      <p className="text-center text-base">
        {statusMessage(t, status, ordersInQueue)}
      </p>
    </div>
  );
}
