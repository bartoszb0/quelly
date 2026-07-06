import { Card } from "@/components/ui/card";
import type { GuestOrder } from "@/types/GuestOrder";

export default function OrderItems({
  items,
}: {
  items: GuestOrder["items"];
}) {
  if (items.length === 0) return null;

  return (
    <Card className="w-full gap-0 p-4">
      <ul className="flex flex-col gap-1 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between gap-4">
            <span>{item.nameSnapshot}</span>
            <span className="tabular-nums text-muted-foreground">
              ×{item.quantity}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
