import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function MenuOrdersTabs({
  ordersCount,
  tab,
  setTab,
}: {
  ordersCount: number;
  tab: string;
  setTab: (tab: "orders" | "menu") => void;
}) {
  const { t } = useTranslation("shop");

  return (
    <div className="flex border-b">
      <button
        onClick={() => setTab("menu")}
        className={cn(
          "-mb-px flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
          tab === "menu"
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {t("tabs.menu")}
      </button>
      <button
        onClick={() => setTab("orders")}
        className={cn(
          "-mb-px flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
          tab === "orders"
            ? "border-primary text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
        )}
      >
        {t("tabs.orders", { count: ordersCount })}
      </button>
    </div>
  );
}
