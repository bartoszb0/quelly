import { getShifts } from "@/api/shift";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useQuery } from "@tanstack/react-query";
import ShiftCard from "./ShiftCard";

export default function ShiftsList({ shopId }: { shopId: string }) {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop-shifts", shopId],
    queryFn: () => getShifts(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  if (data.length === 0) return <EmptyState label="shifts" />;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {data.length} {data.length === 1 ? "shift" : "shifts"} so far
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {data.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </div>
    </>
  );
}
