import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Shop } from "@/types/Shop";
import { QrCode } from "lucide-react";
import QrCustomizerDialog from "./QrCustomizerDialog";

export default function QrCodeCard({ shop }: { shop: Shop }) {
  return (
    <Card className="bg-background">
      <CardHeader className="flex items-center gap-2">
        <QrCode className="size-5 text-muted-foreground" />
        <CardTitle className="text-base">QR code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div>
          <span>Get QR code for your stall</span>
          <QrCustomizerDialog shop={shop} />
        </div>
      </CardContent>
    </Card>
  );
}
