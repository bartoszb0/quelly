import { Card } from "@/components/ui/card";
import { fmtDate, fmtDuration, fmtTime } from "@/lib/dateFormat";
import type { Shift } from "@/types/Shift";

export default function ShiftCard({ shift }: { shift: Shift }) {
  const ongoing = !shift.endedAt;

  return (
    <Card className="flex flex-row items-center justify-between gap-4 p-4 cursor-pointer transition-colors hover:bg-secondary/40 hover:ring-foreground/20">
      <div>
        <p className="font-medium">{fmtDate(shift.startedAt)}</p>
        <p className="text-sm text-muted-foreground">
          {fmtTime(shift.startedAt)} -{" "}
          {ongoing ? "ongoing" : fmtTime(shift.endedAt)}
        </p>
      </div>
      <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
        {ongoing ? "In progress" : fmtDuration(shift.startedAt, shift.endedAt)}
      </span>
    </Card>
  );
}
