import { getShop } from "@/api/public";
import { QueryError } from "@/components/common/QueryError";
import { isValidUuid } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

type ShopPageQuery = {
  name: string;
  publicId: string;
  hasOpenShift: boolean;
};

export default function GuestShopPage() {
  const { shopPublicId } = useParams();

  if (!shopPublicId || !isValidUuid(shopPublicId)) {
    return <Navigate to="/not-found" replace />;
  }

  const { isPending, error, data } = useQuery<ShopPageQuery>({
    queryKey: ["shopPage", shopPublicId],
    queryFn: () => getShop(shopPublicId),
  });

  if (isPending) return "Loading...";

  if (error) return <QueryError error={error} />;

  return <div>{data.name}</div>;
}
