import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Shop } from "@/types/Shop";
import { QrCode } from "lucide-react";
import { useTranslation } from "react-i18next";
import QrCustomizerDialog from "./QrCustomizerDialog";

export default function QrCodeCard({ shop }: { shop: Shop }) {
  const { t } = useTranslation("shop");

  return (
    <Card className="bg-background">
      <CardHeader className="flex items-center gap-2">
        <QrCode className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">{t("cards.qrTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div>
          <span>{t("cards.qrBody")}</span>
          <QrCustomizerDialog shop={shop} />
        </div>
      </CardContent>
    </Card>
  );
}
