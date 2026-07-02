import { Card } from "@/components/ui/card";
import { fmtDate, fmtDuration, fmtTime } from "@/lib/dateFormat";
import type { ShiftListItem } from "@/types/Shift";
import { useNavigate } from "react-router-dom";

export default function ShiftCard({ shift }: { shift: ShiftListItem }) {
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
          {shift.endedAt ? fmtTime(shift.endedAt) : "ongoing"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {shift.ordersCount}
          </span>{" "}
          {shift.ordersCount === 1 ? "order" : "orders"}
        </p>
      </div>
      <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
        {shift.endedAt
          ? fmtDuration(shift.startedAt, shift.endedAt)
          : "In progress"}
      </span>
    </Card>
  );
}
