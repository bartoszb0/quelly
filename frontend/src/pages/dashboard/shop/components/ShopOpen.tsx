import { endShift } from "@/api/shift";
import { Button } from "@/components/ui/button";
import type { ActiveShift } from "@/types/Shift";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ShopOpen({
  shift,
  shopId,
}: {
  shift: ActiveShift;
  shopId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => endShift(shopId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["shop", shopId] });
      toast.success("Shift ended");
    },
    onError: (e) => {
      console.error(e);
      toast.error("Could not end shift");
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1>todo</h1>
      <Button onClick={() => mutate()} disabled={isPending}>
        End shift
      </Button>
      <p>{shift.id}</p>
    </div>
  );
}
