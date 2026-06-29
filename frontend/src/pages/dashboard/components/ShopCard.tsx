import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Shop } from "@/types/Shop";
import { useNavigate } from "react-router-dom";

export default function ShopCard({ shop }: { shop: Shop }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/dashboard/shop/${shop.id}`);
  };

  return (
    <Card
      onClick={handleNavigate}
      className="transition-colors hover:ring-foreground/20 hover:cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="text-base">{shop.name}</CardTitle>
      </CardHeader>
    </Card>
  );
}
