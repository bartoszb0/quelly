import BackBtn from "@/components/common/BackBtn";
import { useShopIdParam } from "@/hooks/useShopIdParam";
import { isValidUuid } from "@/lib/validation";
import { Navigate, useParams } from "react-router-dom";
import ShiftDetail from "./components/ShiftDetail";

export default function ShiftDetailPage() {
  const shopId = useShopIdParam();
  const { shiftId } = useParams();

  if (!shopId || !shiftId || !isValidUuid(shiftId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <BackBtn
        label="Shifts"
        className="-ml-2.5 h-auto py-0.5"
        to={`/dashboard/shop/${shopId}/shifts`}
      />
      <div className="mt-2 mb-1 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Shift</h1>
      </div>

      <ShiftDetail shopId={shopId} shiftId={shiftId} />
    </div>
  );
}
