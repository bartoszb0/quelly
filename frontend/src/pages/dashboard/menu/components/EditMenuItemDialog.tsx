import { updateMenuItem } from "@/api/menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastApiError } from "@/lib/toastApiError";
import { menuItemSchema, type MenuItemInput } from "@/schemas/menuItemSchema";
import type { MenuItem } from "@/types/MenuItem";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DeleteMenuItem from "./DeleteMenuItem";

export default function EditMenuItemDialog({
  item,
  open,
  onOpenChange,
}: {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: { name: item.name },
  });

  const onSubmit = async (values: MenuItemInput) => {
    try {
      await updateMenuItem(item.shopId, item.id, values);
      await queryClient.invalidateQueries({
        queryKey: ["shop-menu", item.shopId],
      });
      toast.success("Menu item updated");
      onOpenChange(false);
    } catch (e) {
      toastApiError(e);
    }
  };

  // Reset the field back to the item's current name whenever the dialog closes
  // so a cancelled edit doesn't linger the next time it opens.
  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset({ name: item.name });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit menu item</DialogTitle>
          <DialogDescription>
            Rename this item or remove it from your menu.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-menu-item-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                autoFocus
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-left text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </fieldset>
        </form>

        <DialogFooter className="sm:justify-between">
          <DeleteMenuItem
            item={item}
            disabled={isSubmitting}
            onDeleted={() => onOpenChange(false)}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              form="edit-menu-item-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
