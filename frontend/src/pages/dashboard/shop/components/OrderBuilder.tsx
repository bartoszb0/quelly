import { getMenuItems } from "@/api/menu";
import { createOrder } from "@/api/order";
import EmptyState from "@/components/common/EmptyState";
import { QueryError } from "@/components/common/QueryError";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toastApiError } from "@/lib/toastApiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderBuilder({
  shopId,
  shiftId,
}: {
  shopId: string;
  shiftId: string;
}) {
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<Record<string, number>>({});

  const {
    isPending,
    error,
    data: menuItems,
    refetch,
  } = useQuery({
    queryKey: ["shop-menu", shopId],
    queryFn: () => getMenuItems(shopId),
  });

  const placeOrder = useMutation({
    mutationFn: () =>
      createOrder(shopId, {
        items: Object.entries(cart).map(([menuItemId, quantity]) => ({
          menuItemId,
          quantity,
        })),
      }),
    onSuccess: async () => {
      setCart({});
      await queryClient.invalidateQueries({
        queryKey: ["shift", shopId, shiftId],
      });
      toast.success("Order placed");
    },
    onError: (e) => toastApiError(e),
  });

  const addItem = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const setQty = (id: string, qty: number) =>
    setCart((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  if (isPending)
    return (
      <div className="flex flex-1 justify-center py-16">
        <Spinner className="size-8" />
      </div>
    );

  if (error) return <QueryError error={error} onRetry={refetch} />;

  const cartEntries = Object.entries(cart);
  const nameOf = (id: string) =>
    menuItems.find((m) => m.id === id)?.name ?? "Item";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Menu</h2>
        {menuItems.length === 0 ? (
          <EmptyState label="menu items" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {menuItems.map((item) => {
              const qty = cart[item.id] ?? 0;
              return (
                <Card
                  key={item.id}
                  onClick={() => addItem(item.id)}
                  className="relative flex h-16 cursor-pointer items-center justify-center p-4 text-center transition-colors hover:bg-secondary/40 hover:ring-foreground/20"
                >
                  {qty > 0 && (
                    <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground tabular-nums">
                      {qty}
                    </span>
                  )}
                  <span className="font-medium wrap-break-word">
                    {item.name}
                  </span>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <Card className="gap-4 p-4">
        <h2 className="text-sm font-medium">New order</h2>

        {cartEntries.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Tap menu items to build an order.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {cartEntries.map(([id, qty]) => (
              <li key={id} className="flex items-center justify-between gap-4">
                <span className="min-w-0 truncate text-sm">{nameOf(id)}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => setQty(id, qty - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus />
                  </Button>
                  <span className="w-5 text-center text-sm tabular-nums">
                    {qty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => setQty(id, qty + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button
          className="w-full"
          onClick={() => placeOrder.mutate()}
          disabled={placeOrder.isPending}
        >
          {placeOrder.isPending
            ? "Placing..."
            : cartEntries.length === 0
              ? "Number only"
              : "Place order"}
        </Button>
      </Card>
    </div>
  );
}
