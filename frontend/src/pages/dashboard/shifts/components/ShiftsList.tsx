import { getShifts } from "@/api/shift";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import PaginationControls from "@/components/common/PaginationControls";
import { QueryError } from "@/components/common/QueryError";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ShiftCard from "./ShiftCard";
import ShiftCardSkeletonList from "./ShiftCardSkeletonList";

export default function ShiftsList({ shopId }: { shopId: string }) {
  const [page, setPage] = useState(1);

  const { t } = useTranslation("shifts");
  const { isPending, isPlaceholderData, error, data, refetch } = useQuery({
    queryKey: ["shop-shifts", shopId, page],
    queryFn: () => getShifts(shopId, page),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  if (data.meta.total === 0) return <EmptyState message={t("empty")} />;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {t("shiftsCount", { count: data.meta.total })}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {isPlaceholderData ? (
          <ShiftCardSkeletonList />
        ) : (
          data.shifts.map((shift) => <ShiftCard key={shift.id} shift={shift} />)
        )}
      </div>
      <PaginationControls
        currentPage={page}
        totalPages={data.meta.totalPages}
        onPageChange={setPage}
      />
    </>
  );
}
