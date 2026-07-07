import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function MenuItemsCard({ shopId }: { shopId: string }) {
  const { t } = useTranslation("shop");
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-secondary/30 hover:border-accent-foreground"
      onClick={() => navigate(`/dashboard/shop/${shopId}/menu`)}
    >
      <CardHeader className="flex items-center gap-2">
        <UtensilsCrossed className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">{t("cards.menuTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {t("cards.menuBody")}
      </CardContent>
    </Card>
  );
}
