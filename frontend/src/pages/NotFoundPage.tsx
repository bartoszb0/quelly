import { Button } from "@/components/ui/button";
import { MapPinOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MapPinOff className="size-7" />
      </div>

      <div>
        <p className="text-7xl font-bold tracking-tight tabular-nums">404</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          {t("notFound.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("notFound.body")}
        </p>
      </div>

      <Button asChild className="mt-2">
        <Link to="/">{t("notFound.backHome")}</Link>
      </Button>
    </div>
  );
}
