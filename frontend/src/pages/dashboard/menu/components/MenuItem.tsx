import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MenuItem } from "@/types/MenuItem";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import EditMenuItemDialog from "./EditMenuItemDialog";

export default function MenuItem({
  item,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
}: {
  item: MenuItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const { t } = useTranslation("menu");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="relative flex h-26 cursor-pointer items-center justify-center px-9 py-4 text-center transition-colors hover:bg-secondary/40 hover:ring-foreground/20"
      >
        <span className="font-medium wrap-break-word">{item.name}</span>

        <div className="absolute inset-y-1 right-1 flex flex-col justify-center gap-1">
          <MoveButton
            label={t("moveUp")}
            disabled={!canMoveUp}
            onClick={onMoveUp}
          >
            <ChevronUp />
          </MoveButton>
          <MoveButton
            label={t("moveDown")}
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            <ChevronDown />
          </MoveButton>
        </div>
      </Card>

      <EditMenuItemDialog item={item} open={open} onOpenChange={setOpen} />
    </>
  );
}

// A reorder arrow. Stops propagation so tapping it doesn't open the edit dialog.
function MoveButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      className="text-muted-foreground"
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </Button>
  );
}
