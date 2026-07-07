import { getMenuItems } from "@/api/menu";
import EmptyState from "@/components/common/EmptyState";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import MenuItem from "./MenuItem";

export default function MenuItems({ shopId }: { shopId: string }) {
  const { t } = useTranslation("menu");
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop-menu", shopId],
    queryFn: () => getMenuItems(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  if (data.length === 0) return <EmptyState message={t("empty")} />;

  return (
    <>
      <p className="text-sm text-muted-foreground">
        {t("itemsCount", { count: data.length })}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {data.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
