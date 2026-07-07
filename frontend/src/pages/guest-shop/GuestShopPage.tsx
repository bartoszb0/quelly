import { getShop } from "@/api/public";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
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
    <div className="relative mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center px-6 py-12">
      <LanguageSwitcher className="absolute top-4 right-4" />
      <ShopName name={data.name} />
      {data.hasOpenShift ? (
        <NumberForm shopPublicId={shopPublicId} />
      ) : (
        <NoShift />
      )}
    </div>
  );
}
