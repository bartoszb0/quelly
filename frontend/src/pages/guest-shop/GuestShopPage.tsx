import { getShop } from "@/api/public";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { isValidUuid } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import NoShift from "./components/NoShift";
import NumberForm from "./components/NumberForm";
import ShopName from "./components/ShopName";

export default function GuestShopPage() {
  const { shopPublicId } = useParams();

  if (!shopPublicId || !isValidUuid(shopPublicId)) {
    return <Navigate to="/not-found" replace />;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ["shopPage", shopPublicId],
    queryFn: () => getShop(shopPublicId),
  });

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} redirectOn404 />;

  return (
    <div className="flex flex-col">
      {data.name}
      <ShopName name={data.name} />
      {data.hasOpenShift ? (
        <NumberForm shopPublicId={shopPublicId} />
      ) : (
        <NoShift />
      )}
    </div>
  );
}
