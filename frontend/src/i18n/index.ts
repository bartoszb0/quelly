import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enDashboard from "./locales/en/dashboard.json";
import enGuest from "./locales/en/guest.json";
import enHome from "./locales/en/home.json";
import enMenu from "./locales/en/menu.json";
import enQr from "./locales/en/qr.json";
import enShifts from "./locales/en/shifts.json";
import enShop from "./locales/en/shop.json";
import plAuth from "./locales/pl/auth.json";
import plCommon from "./locales/pl/common.json";
import plDashboard from "./locales/pl/dashboard.json";
import plGuest from "./locales/pl/guest.json";
import plHome from "./locales/pl/home.json";
import plMenu from "./locales/pl/menu.json";
import plQr from "./locales/pl/qr.json";
import plShifts from "./locales/pl/shifts.json";
import plShop from "./locales/pl/shop.json";

export const SUPPORTED_LANGUAGES = ["pl", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = "i18nextLng";

function initialLanguage(): SupportedLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
      return stored as SupportedLanguage;
    }
  } catch {
    // localStorage unavailable (private mode etc.) — fall back to the default.
  }
  return "pl";
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        common: plCommon,
        auth: plAuth,
        dashboard: plDashboard,
        menu: plMenu,
        shifts: plShifts,
        shop: plShop,
        qr: plQr,
        guest: plGuest,
        home: plHome,
      },
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        menu: enMenu,
        shifts: enShifts,
        shop: enShop,
        qr: enQr,
        guest: enGuest,
        home: enHome,
      },
    },
    lng: initialLanguage(),
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    ns: [
      "common",
      "auth",
      "dashboard",
      "menu",
      "shifts",
      "shop",
      "qr",
      "guest",
      "home",
    ],
    defaultNS: "common",
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
    },
    interpolation: {
      escapeValue: false,
    },
  });

function syncDocument(lng: string) {
  document.documentElement.lang = lng;
  document.title = i18n.t("common:appTitle");
}

syncDocument(i18n.resolvedLanguage ?? "pl");
i18n.on("languageChanged", syncDocument);

export default i18n;
