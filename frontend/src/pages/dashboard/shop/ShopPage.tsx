import { getShop } from "@/api/shop";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useShopIdParam } from "@/hooks/useShopIdParam";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import ShopClosed from "./components/ShopClosed";
import ShopOpen from "./components/ShopOpen";

export default function ShopPage() {
  const shopId = useShopIdParam();

  if (!shopId) return <Navigate to="/dashboard" replace />;

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => getShop(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  return data.activeShift ? (
    <ShopOpen shift={data.activeShift} />
  ) : (
    <ShopClosed shop={data} />
  );
}
