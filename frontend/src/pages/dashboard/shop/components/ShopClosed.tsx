import { startShift } from "@/api/shift";
import { Button } from "@/components/ui/button";
import type { Shop } from "@/types/Shop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { toast } from "sonner";
import MenuItemsCard from "./MenuItemsCard";
import PastShiftsCard from "./PastShiftsCard";
import QrCodeCard from "./QrCodeCard";

export default function ShopClosed({ shop }: { shop: Shop }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => startShift(shop.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shop", shop.id] });
      toast.success("Shift started");
    },
    onError: (e) => {
      console.error(e);
      toast.error("Could not start shift");
    },
  });
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Closed hero */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          No active shift
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Start a shift to begin taking orders. Guests can watch their place in
          line the moment you do.
        </p>
        <Button
          className="mt-6 h-11 px-6 text-base"
          onClick={() => mutate()}
          disabled={isPending}
        >
          <Play className="size-4" />
          Start shift
        </Button>
      </div>

      {/* Setup cards */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <MenuItemsCard shopId={shop.id} />

        <PastShiftsCard shopId={shop.id} />

        <QrCodeCard shop={shop} />
      </div>
    </div>
  );
}
