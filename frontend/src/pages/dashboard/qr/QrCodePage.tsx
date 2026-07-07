import { getShop } from "@/api/shop";
import BackBtn from "@/components/common/BackBtn";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useShopIdParam } from "@/hooks/useShopIdParam";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QrCustomizer from "./components/QrCustomizer";

export default function QrCodePage() {
  const { t } = useTranslation("qr");
  const shopId = useShopIdParam();

  if (!shopId) return <Navigate to="/dashboard" replace />;

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => getShop(shopId),
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <BackBtn className="-ml-2.5 h-auto py-0.5" />
      <div className="mt-2 mb-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </div>

      {isPending ? (
        <LoadingSpinner />
      ) : error ? (
        <QueryError error={error} onRetry={refetch} />
      ) : (
        <QrCustomizer shop={data} />
      )}
    </div>
  );
}
