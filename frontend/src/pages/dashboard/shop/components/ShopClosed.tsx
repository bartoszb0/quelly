import { startShift } from "@/api/shift";
import { Button } from "@/components/ui/button";
import type { Shop } from "@/types/Shop";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import MenuItemsCard from "./MenuItemsCard";
import PastShiftsCard from "./PastShiftsCard";
import QrCodeCard from "./QrCodeCard";

export default function ShopClosed({ shop }: { shop: Shop }) {
  const { t } = useTranslation("shop");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => startShift(shop.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shop", shop.id] });
      toast.success(t("closed.started"));
    },
    onError: (e) => {
      console.error(e);
      toast.error(t("closed.startFailed"));
    },
  });
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Closed hero */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("closed.title")}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("closed.body")}
        </p>
        <Button
          className="mt-6 h-11 px-6 text-base"
          onClick={() => mutate()}
          disabled={isPending}
        >
          <Play className="size-4" />
          {t("closed.startShift")}
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
