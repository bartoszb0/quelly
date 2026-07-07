import { getShifts } from "@/api/shift";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ShiftCard from "./ShiftCard";

export default function ShiftsList({ shopId }: { shopId: string }) {
  const { t } = useTranslation("shifts");
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop-shifts", shopId],
    queryFn: () => getShifts(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  if (data.length === 0) return <EmptyState message={t("empty")} />;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {t("shiftsCount", { count: data.length })}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {data.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))}
      </div>
    </>
  );
}
