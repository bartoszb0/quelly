import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type FlyerOptions = {
  qrDataUrl: string; // PNG data URL of the QR code
  shopName: string;
  instruction: string; // localized "scan to track" line
  pageBg: string; // hex — page background
  text: string; // hex — title + instruction color
  qrLight: string; // hex — tile behind the QR
};

function toWinAnsiSafe(value: string): string {
  return value
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .normalize("NFC");
}

// A4 in PDF points.
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const QR_SIZE = 400;
const TILE_PAD = 18;
const TILE_RADIUS = 20;
const BRAND_URL = "www.quelly.com";

// SVG path for a rounded rectangle with its top-left corner at (0,0). Used for
// the QR tile since pdf-lib rectangles can't have rounded corners. drawSvgPath
// anchors (0,0) at the given (x, y) with y running downward, so pass the tile's
// top edge as y.
function roundedRectPath(w: number, h: number, r: number): string {
  return [
    `M ${r} 0`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    `Z`,
  ].join(" ");
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function drawCentered(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  y: number,
  color: ReturnType<typeof rgb>,
) {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (PAGE_WIDTH - width) / 2, y, size, font, color });
}

export async function buildQrFlyer({
  qrDataUrl,
  shopName,
  instruction,
  pageBg,
  text,
  qrLight,
}: FlyerOptions): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Theme the whole page background.
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: hexToRgb(pageBg),
  });

  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const qr = await pdf.embedPng(qrDataUrl);
  const ink = hexToRgb(text);

  // Title + instruction.
  drawCentered(page, toWinAnsiSafe(shopName), bold, 44, PAGE_HEIGHT - 140, ink);
  drawCentered(
    page,
    toWinAnsiSafe(instruction),
    regular,
    22,
    PAGE_HEIGHT - 180,
    ink,
  );

  // Light tile behind the QR (keeps the code scannable on dark pages).
  const qrX = (PAGE_WIDTH - QR_SIZE) / 2;
  const qrY = (PAGE_HEIGHT - QR_SIZE) / 2 - 40;
  const tileSize = QR_SIZE + TILE_PAD * 2;
  page.drawSvgPath(roundedRectPath(tileSize, tileSize, TILE_RADIUS), {
    x: qrX - TILE_PAD,
    y: qrY - TILE_PAD + tileSize, // top edge of the tile
    color: hexToRgb(qrLight),
    borderWidth: 0,
  });

  // Big QR, centered on the tile.
  page.drawImage(qr, { x: qrX, y: qrY, width: QR_SIZE, height: QR_SIZE });

  // Brand link, centered at the bottom.
  drawCentered(page, BRAND_URL, regular, 18, 56, ink);

  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
