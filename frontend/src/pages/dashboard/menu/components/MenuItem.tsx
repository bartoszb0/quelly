import { Card } from "@/components/ui/card";
import type { MenuItem } from "@/types/MenuItem";
import { useState } from "react";
import EditMenuItemDialog from "./EditMenuItemDialog";

export default function MenuItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="flex h-26 cursor-pointer items-center justify-center p-4 text-center transition-colors hover:bg-secondary/40 hover:ring-foreground/20"
      >
        <span className="font-medium wrap-break-word">{item.name}</span>
      </Card>

      <EditMenuItemDialog item={item} open={open} onOpenChange={setOpen} />
    </>
  );
}
