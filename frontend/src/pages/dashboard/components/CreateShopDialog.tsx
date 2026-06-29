import { createShop } from "@/api/shop";
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
import { shopSchema, type ShopInput } from "@/schemas/shopSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateShopDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShopInput>({
    resolver: zodResolver(shopSchema),
  });

  const onSubmit = async (values: ShopInput) => {
    try {
      await createShop(values);
      await queryClient.invalidateQueries({ queryKey: ["shops"] });
      toast.success("Shop created");
      setOpen(false);
    } catch (e) {
      toastApiError(e);
    }
  };

  // Reset the form whenever the dialog closes so it opens clean next time.
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>+ Add new</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a shop</DialogTitle>
          <DialogDescription>
            Give your stall a name. You can take orders once it's set up.
          </DialogDescription>
        </DialogHeader>

        <form id="create-shop-form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Mario's Tacos"
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
          <Button type="submit" form="create-shop-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create shop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
