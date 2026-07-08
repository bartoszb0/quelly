import { getShift } from "@/api/shift";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { SHOP_SUB_PAGES } from "@/constants/subPages";
import { fmtTime } from "@/lib/dateFormat";
import type { ActiveShift } from "@/types/Shift";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import MiniCard from "./cards/MiniCard";
import EndShiftButton from "./shopOpen/EndShiftButton";
import MenuOrdersTabs from "./shopOpen/MenuOrdersTabs";
import OrderBuilder from "./shopOpen/OrderBuilder";
import OrdersSection from "./shopOpen/OrdersSection";

export default function ShopOpen({
  shift,
  shopId,
}: {
  shift: ActiveShift;
  shopId: string;
}) {
  const { t } = useTranslation("shop");
  const [tab, setTab] = useState<"orders" | "menu">("menu");

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shift", shopId, shift.id],
    queryFn: () => getShift(shopId, shift.id),
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      {isPending ? (
        <LoadingSpinner />
      ) : error ? (
        <QueryError error={error} onRetry={refetch} />
      ) : (
        <div className="flex flex-col gap-6">
          <MenuOrdersTabs
            ordersCount={data.meta.total}
            tab={tab}
            setTab={setTab}
          />

          <div className={tab === "orders" ? undefined : "hidden"}>
            <OrdersSection
              orders={data.orders}
              shopId={shopId}
              shiftId={shift.id}
            />
          </div>
          <div className={tab === "menu" ? "space-y-8" : "hidden"}>
            <OrderBuilder shopId={shopId} shiftId={shift.id} />
            <div className="flex items-center justify-between gap-4 border-t pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  {t("shiftOpenSince", { time: fmtTime(shift.startedAt) })}
                </span>
              </div>
              <EndShiftButton shopId={shopId} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {SHOP_SUB_PAGES.map((subPage) => (
              <MiniCard key={subPage.path} shopId={shopId} subPage={subPage} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
