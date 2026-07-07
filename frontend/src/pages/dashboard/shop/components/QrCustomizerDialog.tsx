import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { downloadBlob } from "@/lib/download";
import { generateQrDataUrl, QR_COLORSETS, type QrColorset } from "@/lib/qr";
import { buildQrFlyer } from "@/lib/qrFlyer";
import { cn } from "@/lib/utils";
import type { Shop } from "@/types/Shop";
import { Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function QrCustomizerDialog({ shop }: { shop: Shop }) {
  const { t } = useTranslation("shop");
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
        instruction: t("qrDialog.scanToTrack"),
        pageBg: colorset.pageBg,
        text: colorset.text,
        qrLight: colorset.qrLight,
      });
      downloadBlob(blob, "quelly-qr.pdf");
    } catch {
      toast.error(t("qrDialog.pdfFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mt-4 w-full">
          {t("cards.qrCustomize")}
        </Button>
      </DialogTrigger>

      <DialogContent className="grid-rows-[auto_minmax(0,1fr)_auto] max-h-[calc(100dvh-2rem)] overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("qrDialog.title")}</DialogTitle>
          <DialogDescription>{t("qrDialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 gap-6 overflow-y-auto sm:grid-cols-[auto_1fr]">
          {/* Full-page A4 preview (mirrors the PDF) */}
          <div
            className="mx-auto flex aspect-[210/297] w-full max-w-[240px] flex-col items-center rounded-md border shadow-sm"
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
              {t("qrDialog.scanToTrack")}
            </p>
            {preview && (
              <div
                className="mt-[10%] w-3/5 rounded p-2"
                style={{ backgroundColor: colorset.qrLight }}
              >
                <img
                  src={preview}
                  alt={t("qrDialog.previewAlt")}
                  className="w-full"
                />
              </div>
            )}
            <span
              className="mt-auto mb-[8%] text-[10px]"
              style={{ color: colorset.text }}
            >
              www.quelly.com
            </span>
          </div>

          {/* Colorset picker */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">
              {t("qrDialog.colorScheme")}
            </span>
            <div className="grid max-h-[320px] grid-cols-3 gap-2 overflow-y-auto pr-1">
              {QR_COLORSETS.map((cs) => {
                const selected = cs.name === colorset.name;
                return (
                  <button
                    key={cs.name}
                    type="button"
                    onClick={() => setColorset(cs)}
                    title={t(`qrDialog.colors.${cs.name}`)}
                    className={cn(
                      "relative flex flex-col items-center gap-1 rounded-md border p-2 transition-colors hover:bg-secondary/40",
                      selected && "ring-2 ring-ring",
                    )}
                  >
                    <span
                      className="flex h-10 w-full items-center justify-center rounded"
                      style={{ backgroundColor: cs.pageBg }}
                    >
                      <span
                        className="flex size-6 items-center justify-center rounded-sm"
                        style={{ backgroundColor: cs.qrLight }}
                      >
                        <span
                          className="size-3 rounded-[1px]"
                          style={{ backgroundColor: cs.qrDark }}
                        />
                      </span>
                    </span>
                    <span className="text-[11px]">
                      {t(`qrDialog.colors.${cs.name}`)}
                    </span>
                    {selected && (
                      <Check className="absolute right-1 top-1 size-3.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("common:cancel")}</Button>
          </DialogClose>
          <Button
            onClick={handleDownloadPdf}
            disabled={isGenerating || !preview}
          >
            <Download className="size-4" />
            {isGenerating ? t("qrDialog.preparing") : t("qrDialog.download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
