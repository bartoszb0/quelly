import { createMenuItem } from "@/api/menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastApiError } from "@/lib/toastApiError";
import { menuItemSchema, type MenuItemInput } from "@/schemas/menuItemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddMenuItem({ shopId }: { shopId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemInput>({
    resolver: zodResolver(menuItemSchema),
  });

  const onSubmit = async (values: MenuItemInput) => {
    try {
      await createMenuItem(shopId, values);
      await queryClient.invalidateQueries({ queryKey: ["shop-menu", shopId] });
      toast.success("Menu item added");
      setOpen(false);
    } catch (e) {
      toastApiError(e);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="shrink-0">
          <Plus />
          Add new item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add menu item</DialogTitle>
          <DialogDescription>
            Add something guests can order from your stall.
          </DialogDescription>
        </DialogHeader>

        <form id="add-menu-item-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Cheeseburger"
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

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="add-menu-item-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
