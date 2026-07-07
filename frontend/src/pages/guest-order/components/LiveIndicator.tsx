import { fmtTime } from "@/lib/dateFormat";
import { useTranslation } from "react-i18next";

export default function LiveIndicator({
  isActive,
  createdAt,
}: {
  isActive: boolean;
  createdAt: string;
}) {
  const { t } = useTranslation("guest");

  return (
    <div className="flex flex-col items-center gap-2">
      {isActive && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          {t("updatingLive")}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        {t("placedAt", { time: fmtTime(createdAt) })}
      </p>
    </div>
  );
}
