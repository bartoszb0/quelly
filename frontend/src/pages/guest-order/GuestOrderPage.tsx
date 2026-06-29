import { getOrder } from "@/api/public";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QueryError } from "@/components/common/QueryError";
import { useOrderSocket } from "@/hooks/useOrderSocket";
import { isValidUuid } from "@/lib/validation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

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

  return (
    <div>
      <h1>Your number: {data.number}</h1>
      {data.ordersInQueue !== null && (
        <h1>Orders in queue: {data.ordersInQueue}</h1>
      )}
      <h1>Status: {data.status}</h1>
      <h1>Placed at: {data.createdAt}</h1>

      <div className="flex flex-col mt-10">
        {data.items.map((item, index) => (
          <h2 key={index}>
            {item.nameSnapshot} - x{item.quantity}
          </h2>
        ))}
      </div>
    </div>
  );
}
