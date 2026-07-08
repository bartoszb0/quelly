import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShopSubPage } from "@/constants/subPages";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function MiniCard({
  shopId,
  subPage,
}: {
  shopId: string;
  subPage: ShopSubPage;
}) {
  const { t } = useTranslation("shop");
  const navigate = useNavigate();
  const { icon: Icon, titleKey, path } = subPage;

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-secondary/30 hover:border-accent-foreground"
      onClick={() => navigate(`/dashboard/shop/${shopId}/${path}`)}
    >
      <CardHeader className="flex items-center gap-2">
        <Icon className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">{t(titleKey)}</CardTitle>
      </CardHeader>
    </Card>
  );
}
