import { getOrder } from "@/api/public";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useOrderSocket } from "@/hooks/useOrderSocket";
import { isValidUuid } from "@/lib/validation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import LiveIndicator from "./components/LiveIndicator";
import OrderItems from "./components/OrderItems";
import OrderProgress from "./components/OrderProgress";
import OrderStatusIcon from "./components/OrderStatusIcon";
import OrderStatusMessage from "./components/OrderStatusMessage";

export default function GuestOrderPage() {
  const { shopPublicId, orderNumber } = useParams();
  const queryClient = useQueryClient();

  const valid = !!orderNumber && !!shopPublicId && isValidUuid(shopPublicId);

  const { isPending, error, data } = useQuery({
    queryKey: ["orderPage", shopPublicId, orderNumber],
    queryFn: () => getOrder(shopPublicId!, orderNumber!),
    enabled: valid,
  });

  useOrderSocket(shopPublicId, valid, () => {
    queryClient.invalidateQueries({
      queryKey: ["orderPage", shopPublicId, orderNumber],
    });
  });

  if (!valid) return <Navigate to="/not-found" replace />;

  if (isPending) return <LoadingSpinner />;

  if (error) return <QueryError error={error} redirectOn404 />;

  const isActive = data.status === "QUEUED" || data.status === "READY";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-6 py-12">
      <OrderStatusIcon status={data.status} />

      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">Your number</p>
        <p className="mt-1 text-7xl font-bold tracking-tight tabular-nums">
          #{data.number}
        </p>
      </div>

      <OrderStatusMessage
        status={data.status}
        ordersInQueue={data.ordersInQueue}
      />

      <OrderProgress status={data.status} />

      <OrderItems items={data.items} />

      <LiveIndicator isActive={isActive} createdAt={data.createdAt} />
    </div>
  );
}
