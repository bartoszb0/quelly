import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import type { TemporaryShop } from "./ShopList";

export default function ShopCard({ shop }: { shop: TemporaryShop }) {
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
