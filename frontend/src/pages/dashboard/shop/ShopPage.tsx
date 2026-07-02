import { getShop } from "@/api/shop";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { isValidUuid } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import ShopClosed from "./components/ShopClosed";
import ShopOpen from "./components/ShopOpen";

export default function ShopPage() {
  const { shopId } = useParams();

  if (!shopId || !isValidUuid(shopId)) {
    return <Navigate to="/dashboard" replace />;
  }

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => getShop(shopId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} onRetry={refetch} />;

  // TODO: drive this from the shop's active shift once getShop returns shift
  // state (mirror the guest `hasOpenShift` field on the owner endpoint).
  const hasOpenShift = false;

  return hasOpenShift ? <ShopOpen /> : <ShopClosed shop={data} />;
}
