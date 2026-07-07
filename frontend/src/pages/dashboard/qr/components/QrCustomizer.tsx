import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadBlob } from "@/lib/download";
import { generateQrDataUrl, QR_COLORSETS, type QrColorset } from "@/lib/qr";
import { buildQrFlyer } from "@/lib/qrFlyer";
import { cn } from "@/lib/utils";
import type { Shop } from "@/types/Shop";
import { Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function QrCustomizer({ shop }: { shop: Shop }) {
  const { t } = useTranslation("qr");
  const guestUrl = `${window.location.origin}/s/${shop.publicId}`;

  const [colorset, setColorset] = useState<QrColorset>(QR_COLORSETS[0]);
  const [preview, setPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Regenerate the QR whenever the colorset changes. Rendered large + small
  // margin so it stays crisp in print.
  useEffect(() => {
    let active = true;
    generateQrDataUrl(guestUrl, {
      dark: colorset.qrDark,
      light: colorset.qrLight,
      width: 1024,
      margin: 2,
    })
      .then((url) => active && setPreview(url))
      .catch(() => active && setPreview(""));
    return () => {
      active = false;
    };
  }, [guestUrl, colorset]);

  const handleDownloadPdf = async () => {
    if (!preview) return;
    setIsGenerating(true);
    try {
      const blob = await buildQrFlyer({
        qrDataUrl: preview,
        shopName: shop.name,
        instruction: t("scanToTrack"),
        pageBg: colorset.pageBg,
        text: colorset.text,
        qrLight: colorset.qrLight,
      });
      downloadBlob(blob, "quelly-qr.pdf");
    } catch {
      toast.error(t("pdfFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
      {/* Full-page A4 preview (mirrors the PDF), sticky so it stays visible while picking a color */}
      <Card className="mx-auto w-full max-w-70 overflow-hidden p-0 shadow-sm lg:sticky lg:top-6">
        <div
          className="flex aspect-210/297 w-full flex-col items-center"
          style={{ backgroundColor: colorset.pageBg }}
        >
          <p
            className="mt-[14%] px-4 text-center text-lg font-bold"
            style={{ color: colorset.text }}
          >
            {shop.name}
          </p>
          <p
            className="mt-1 px-4 text-center text-[11px]"
            style={{ color: colorset.text }}
          >
            {t("scanToTrack")}
          </p>
          {preview && (
            <div
              className="mt-[10%] w-3/5 rounded p-2"
              style={{ backgroundColor: colorset.qrLight }}
            >
              <img src={preview} alt={t("previewAlt")} className="w-full" />
            </div>
          )}
          <span
            className="mt-auto mb-[8%] text-[10px]"
            style={{ color: colorset.text }}
          >
            www.quelly.com
          </span>
        </div>
      </Card>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("colorScheme")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {QR_COLORSETS.map((cs) => {
                const selected = cs.name === colorset.name;
                return (
                  <button
                    key={cs.name}
                    type="button"
                    onClick={() => setColorset(cs)}
                    title={t(`colors.${cs.name}`)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-lg border p-3 transition-all hover:bg-secondary/40 hover:shadow-sm",
                      selected
                        ? "ring-2 ring-ring border-transparent"
                        : "border-border",
                    )}
                  >
                    <span
                      className="flex h-12 w-full items-center justify-center rounded-md"
                      style={{ backgroundColor: cs.pageBg }}
                    >
                      <span
                        className="flex size-7 items-center justify-center rounded"
                        style={{ backgroundColor: cs.qrLight }}
                      >
                        <span
                          className="size-3.5 rounded-[1px]"
                          style={{ backgroundColor: cs.qrDark }}
                        />
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t(`colors.${cs.name}`)}
                    </span>
                    {selected && (
                      <Check className="absolute right-1.5 top-1.5 size-3.5 text-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="self-end"
          onClick={handleDownloadPdf}
          disabled={isGenerating || !preview}
        >
          <Download className="size-4" />
          {isGenerating ? t("preparing") : t("download")}
        </Button>
      </div>
    </div>
  );
}
