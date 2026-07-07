import { endShift } from "@/api/shift";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OctagonX } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function EndShiftButton({ shopId }: { shopId: string }) {
  const { t } = useTranslation("shop");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => endShift(shopId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["shop", shopId] }),
        queryClient.invalidateQueries({ queryKey: ["shop-shifts", shopId] }),
      ]);
      toast.success(t("endShift.ended"));
    },
    onError: (e) => {
      console.error(e);
      toast.error(t("endShift.failed"));
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <OctagonX />
          {t("endShift.button")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("endShift.confirmTitle")}</DialogTitle>
          <DialogDescription>{t("endShift.confirmBody")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("common:cancel")}</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? t("endShift.ending") : t("endShift.button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
