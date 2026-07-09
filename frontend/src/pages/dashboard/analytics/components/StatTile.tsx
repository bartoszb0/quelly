import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export default function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Card className="gap-3 p-4">
      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </Card>
  );
}
