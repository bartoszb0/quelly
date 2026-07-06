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
import { toast } from "sonner";

export default function EndShiftButton({ shopId }: { shopId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => endShift(shopId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["shop", shopId] }),
        queryClient.invalidateQueries({ queryKey: ["shop-shifts", shopId] }),
      ]);
      toast.success("Shift ended");
    },
    onError: (e) => {
      console.error(e);
      toast.error("Could not end shift");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <OctagonX />
          End shift
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End this shift?</DialogTitle>
          <DialogDescription>
            Any orders still queued or ready will be cancelled. This can't be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Ending..." : "End shift"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
