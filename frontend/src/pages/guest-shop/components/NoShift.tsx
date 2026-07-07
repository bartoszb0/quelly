import { useTranslation } from "react-i18next";

export default function NoShift() {
  const { t } = useTranslation("guest");

  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-muted-foreground/50" />
        {t("closed")}
      </span>
      <p className="mt-4 max-w-xs text-sm text-muted-foreground">
        {t("closedBody")}
      </p>
    </div>
  );
}
