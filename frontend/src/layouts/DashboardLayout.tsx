import { getShop } from "@/api/shop";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useShopIdParam } from "@/hooks/useShopIdParam";
import ShopHeader from "@/pages/dashboard/shop/components/ShopHeader";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const shopId = useShopIdParam();

  if (!shopId) return <Navigate to="/dashboard" replace />;

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => getShop(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  return (
    <>
      <ShopHeader name={data.name} />
      <Outlet />
    </>
  );
}
