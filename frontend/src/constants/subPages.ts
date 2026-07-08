import type { ShopSubPage } from "@/types/SubPage";
import {
  ChartNoAxesCombined,
  History,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";

export const SHOP_SUB_PAGES: ShopSubPage[] = [
  {
    icon: UtensilsCrossed,
    titleKey: "cards.menuTitle",
    bodyKey: "cards.menuBody",
    path: "menu",
  },
  {
    icon: History,
    titleKey: "cards.shiftsTitle",
    bodyKey: "cards.shiftsBody",
    path: "shifts",
  },
  {
    icon: QrCode,
    titleKey: "cards.qrTitle",
    bodyKey: "cards.qrBody",
    path: "qr",
  },
  {
    icon: ChartNoAxesCombined,
    titleKey: "cards.analyticsTitle",
    bodyKey: "cards.analyticsBody",
    path: "analytics",
  },
];
