import BackBtn from "@/components/common/BackBtn";
import { useShopIdParam } from "@/hooks/useShopIdParam";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import ShiftsList from "./components/ShiftsList";

export default function ShiftsPage() {
  const { t } = useTranslation("shifts");
  const shopId = useShopIdParam();

  if (!shopId) return <Navigate to="/dashboard" replace />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <BackBtn className="-ml-2.5 h-auto py-0.5" />
      <div className="mt-2 mb-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      </div>

      <ShiftsList shopId={shopId} />
    </div>
  );
}
