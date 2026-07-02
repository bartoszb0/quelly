import { isValidUuid } from "@/lib/validation";
import { useParams } from "react-router-dom";

export function useShopIdParam(): string | null {
  const { shopId } = useParams();
  return shopId && isValidUuid(shopId) ? shopId : null;
}
