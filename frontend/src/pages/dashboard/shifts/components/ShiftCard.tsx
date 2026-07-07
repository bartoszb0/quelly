import { Card } from "@/components/ui/card";
import { fmtDate, fmtDuration, fmtTime } from "@/lib/dateFormat";
import type { ShiftListItem } from "@/types/Shift";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ShiftCard({ shift }: { shift: ShiftListItem }) {
  const { t } = useTranslation("shifts");
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/dashboard/shop/${shift.shopId}/shifts/${shift.id}`);
  };

  return (
    <Card
      className="flex flex-row items-center justify-between gap-4 p-4 cursor-pointer transition-colors hover:bg-secondary/40 hover:ring-foreground/20"
      onClick={handleNavigate}
    >
      <div>
        <p className="font-medium">{fmtDate(shift.startedAt)}</p>
        <p className="text-sm text-muted-foreground">
          {fmtTime(shift.startedAt)} -{" "}
          {shift.endedAt ? fmtTime(shift.endedAt) : t("ongoing")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {shift.ordersCount}
          </span>{" "}
          {t("ordersLabel", { count: shift.ordersCount })}
        </p>
      </div>
      <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
        {shift.endedAt
          ? fmtDuration(shift.startedAt, shift.endedAt)
          : t("inProgress")}
      </span>
    </Card>
  );
}
