import EmptyState from "@/components/common/EmptyState";
import type { Order } from "@/types/Order";
import { useTranslation } from "react-i18next";
import OrderConsoleCard from "./OrderConsoleCard";

export default function OrdersSection({
  orders,
  shopId,
  shiftId,
}: {
  orders: Order[];
  shopId: string;
  shiftId: string;
}) {
  const { t } = useTranslation("shifts");

  if (orders.length === 0) return <EmptyState message={t("emptyOrders")} />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <OrderConsoleCard
          key={order.id}
          order={order}
          shopId={shopId}
          shiftId={shiftId}
        />
      ))}
    </div>
  );
}
