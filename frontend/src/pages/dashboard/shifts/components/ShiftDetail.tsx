import { getShift } from "@/api/shift";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { Button } from "@/components/ui/button";
import { fmtDate, fmtDuration, fmtTime } from "@/lib/dateFormat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import OrderCard from "./OrderCard";

export default function ShiftDetail({
  shopId,
  shiftId,
}: {
  shopId: string;
  shiftId: string;
}) {
  const { t } = useTranslation("shifts");
  const {
    isPending,
    error,
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["shift", shopId, shiftId, "orders"],
    queryFn: ({ pageParam }) => getShift(shopId, shiftId, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.nextCursor : undefined,
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  const shift = data.pages[0].shift;

  const orders = data.pages.flatMap((page) => page.orders);

  return (
    <>
      <div className="mt-2 mb-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {fmtDate(shift.startedAt)}
        </h1>
      </div>

      <p className="text-sm text-muted-foreground">
        {fmtTime(shift.startedAt)} -{" "}
        {shift.endedAt ? fmtTime(shift.endedAt) : t("ongoing")}
        {shift.endedAt && <> · {fmtDuration(shift.startedAt, shift.endedAt)}</>}
      </p>

      {orders.length === 0 ? (
        <EmptyState message={t("emptyOrders")} />
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
          {hasNextPage && (
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? t("loadingMore") : t("loadMore")}
            </Button>
          )}
        </div>
      )}
    </>
  );
}
