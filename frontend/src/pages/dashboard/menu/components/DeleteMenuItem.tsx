import { deleteMenuItem } from "@/api/menu";
import { Button } from "@/components/ui/button";
import { toastApiError } from "@/lib/toastApiError";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/MenuItem";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteMenuItem({
  item,
  disabled,
  onDeleted,
}: {
  item: MenuItem;
  disabled?: boolean;
  onDeleted: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  // First click arms the delete; the second actually removes the item.
  const handleClick = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteMenuItem(item.shopId, item.id);
      await queryClient.invalidateQueries({
        queryKey: ["shop-menu", item.shopId],
      });
      toast.success("Menu item deleted");
      onDeleted();
    } catch (e) {
      toastApiError(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      className={cn(
        confirm && "bg-destructive text-white hover:bg-destructive/90",
      )}
      onClick={handleClick}
      disabled={disabled || isDeleting}
    >
      <Trash2 />
      {isDeleting ? "Deleting..." : confirm ? "Confirm delete" : "Delete"}
    </Button>
  );
}
