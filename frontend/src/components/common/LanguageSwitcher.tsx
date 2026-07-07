import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const LABELS: Record<SupportedLanguage, string> = {
  pl: "PL",
  en: "EN",
};

export default function LanguageSwitcher({
  className,
}: {
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage;

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "flex items-center gap-0.5 rounded-full border p-0.5",
        className,
      )}
    >
      {SUPPORTED_LANGUAGES.map((lng) => (
        <button
          key={lng}
          type="button"
          aria-pressed={current === lng}
          onClick={() => i18n.changeLanguage(lng)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            current === lng
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {LABELS[lng]}
        </button>
      ))}
    </div>
  );
}
