import i18n from "@/i18n";

function locale() {
  return i18n.resolvedLanguage;
}

export function fmtDate(iso: string) {
  const formatted = new Date(iso).toLocaleDateString(locale(), {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(locale(), {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtDuration(start: string, end: string) {
  const mins = Math.max(
    0,
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000),
  );
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0
    ? i18n.t("common:duration.hoursMinutes", { hours: h, minutes: m })
    : i18n.t("common:duration.minutes", { minutes: m });
}
