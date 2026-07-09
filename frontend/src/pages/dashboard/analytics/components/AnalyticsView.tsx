import { getAnalytics } from "@/api/analytics";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  History,
  Package,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import OrderOutcomes from "./OrderOutcomes";
import StatTile from "./StatTile";
import TopSellers from "./TopSellers";

export default function AnalyticsView({ shopId }: { shopId: string }) {
  const { t } = useTranslation("analytics");
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop-analytics", shopId],
    queryFn: () => getAnalytics(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  if (data.totalOrders === 0) return <EmptyState message={t("empty")} />;

  const dec = (n: number) => n.toFixed(1);

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* Two charts carry the headline story */}
      <div className="grid gap-4 lg:grid-cols-2">
        <OrderOutcomes data={data} />
        {data.topSellers.length > 0 && <TopSellers items={data.topSellers} />}
      </div>

      {/* Supporting figures the charts don't cover */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile
          icon={ReceiptText}
          label={t("stats.totalOrders")}
          value={String(data.totalOrders)}
        />
        <StatTile
          icon={History}
          label={t("stats.totalShifts")}
          value={String(data.totalShifts)}
        />
        <StatTile
          icon={Activity}
          label={t("stats.avgOrdersPerShift")}
          value={dec(data.avgOrdersPerShift)}
        />
        <StatTile
          icon={Package}
          label={t("stats.itemsSold")}
          value={String(data.totalItemsSold)}
        />
        <StatTile
          icon={ShoppingCart}
          label={t("stats.avgItemsPerOrder")}
          value={dec(data.avgItemsPerOrder)}
        />
      </div>
    </div>
  );
}
