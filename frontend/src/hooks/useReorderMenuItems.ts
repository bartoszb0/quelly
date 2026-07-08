import { reorderMenuItems } from "@/api/menu";
import { toastApiError } from "@/lib/toastApiError";
import type { MenuItem } from "@/types/MenuItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useReorderMenuItems(shopId: string) {
  const queryClient = useQueryClient();
  const menuKey = ["shop-menu", shopId];

  const { mutate } = useMutation({
    mutationFn: (ids: string[]) => reorderMenuItems(shopId, ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: menuKey });
      const previous = queryClient.getQueryData<MenuItem[]>(menuKey);
      if (previous) {
        const byId = new Map(previous.map((item) => [item.id, item]));
        const next = ids
          .map((id) => byId.get(id))
          .filter((item): item is MenuItem => item !== undefined);
        queryClient.setQueryData(menuKey, next);
      }
      return { previous };
    },
    onError: (e, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(menuKey, context.previous);
      }
      toastApiError(e);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menuKey });
    },
  });

  return (items: MenuItem[], index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    mutate(next.map((item) => item.id));
  };
}
