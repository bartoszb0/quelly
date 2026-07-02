import { getMenuItems } from "@/api/menu";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useQuery } from "@tanstack/react-query";
import MenuItem from "./MenuItem";

export default function MenuItems({ shopId }: { shopId: string }) {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop-menu", shopId],
    queryFn: () => getMenuItems(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  return (
    <>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No menu items yet.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? "item" : "items"} on your menu
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
