import { getShift } from "@/api/shift";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { fmtDate, fmtDuration, fmtTime } from "@/lib/dateFormat";
import { useQuery } from "@tanstack/react-query";
import OrderCard from "./OrderCard";

export default function ShiftDetail({
  shopId,
  shiftId,
}: {
  shopId: string;
  shiftId: string;
}) {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shift", shopId, shiftId],
    queryFn: () => getShift(shopId, shiftId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  return (
    <>
      <div className="mt-2 mb-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {fmtDate(data.startedAt)}
        </h1>
      </div>

      <p className="text-sm text-muted-foreground">
        {fmtTime(data.startedAt)} -{" "}
        {data.endedAt ? fmtTime(data.endedAt) : "ongoing"}
        {data.endedAt && <> · {fmtDuration(data.startedAt, data.endedAt)}</>}
      </p>

      {data.orders.length === 0 ? (
        <EmptyState label="orders" />
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {data.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
