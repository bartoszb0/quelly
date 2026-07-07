import { getShops } from "@/api/shop";
import { QueryError } from "@/components/common/QueryError";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ShopCard from "./ShopCard";

export default function ShopList() {
  const { t } = useTranslation("dashboard");
  const { isPending, error, data } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getShops(),
  });

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) return <QueryError error={error} />;

  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t("noShops")}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
