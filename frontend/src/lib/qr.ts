import QRCode from "qrcode";

export type QrOptions = {
  dark: string;
  light: string;
  width: number;
  margin: number;
};

// Preset color schemes. The page can be themed independently of the QR so that
// dark backgrounds are possible while the code itself stays dark-on-light (and
// therefore reliably scannable): on dark sets the QR sits on its own light tile.
//   pageBg  — flyer page background
//   text    — title + instruction text color
//   qrDark  — QR module color
//   qrLight — QR background / the tile behind the QR
export type QrColorset = {
  name: string;
  pageBg: string;
  text: string;
  qrDark: string;
  qrLight: string;
};

// Light-background sets: page == QR background, dark ink throughout.
const lightSet = (
  name: string,
  pageBg: string,
  ink: string,
): QrColorset => ({ name, pageBg, text: ink, qrDark: ink, qrLight: pageBg });

// Dark-background sets: dark page + light text, QR on a white tile.
const darkSet = (name: string, pageBg: string, text: string): QrColorset => ({
  name,
  pageBg,
  text,
  qrDark: pageBg,
  qrLight: "#ffffff",
});

export const QR_COLORSETS: QrColorset[] = [
  // Light
  lightSet("Classic", "#ffffff", "#000000"),
  lightSet("Slate", "#f1f5f9", "#1e293b"),
  lightSet("Indigo", "#eef2ff", "#312e81"),
  lightSet("Forest", "#f0fdf4", "#14532d"),
  lightSet("Crimson", "#fef2f2", "#7f1d1d"),
  lightSet("Amber", "#fffbeb", "#78350f"),
  lightSet("Rose", "#fff1f2", "#881337"),
  lightSet("Sky", "#f0f9ff", "#075985"),
  lightSet("Teal", "#f0fdfa", "#115e59"),
  lightSet("Stone", "#fafaf9", "#292524"),
  // Dark
  darkSet("Midnight", "#0f172a", "#e2e8f0"),
  darkSet("Charcoal", "#18181b", "#fafafa"),
  darkSet("Plum", "#2e1065", "#ede9fe"),
  darkSet("Pine", "#052e16", "#dcfce7"),
  darkSet("Wine", "#4c0519", "#ffe4e6"),
];

// Render a QR for `text` as a PNG data URL. Used for both the live preview
// and the image embedded into the PDF flyer.
export function generateQrDataUrl(text: string, o: QrOptions): Promise<string> {
  return QRCode.toDataURL(text, {
    color: { dark: o.dark, light: o.light },
    width: o.width,
    margin: o.margin,
  });
}
