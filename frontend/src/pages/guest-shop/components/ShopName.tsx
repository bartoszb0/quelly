import { useTranslation } from "react-i18next";

export default function ShopName({ name }: { name: string }) {
  const { t } = useTranslation("guest");

  return (
    <div className="text-center">
      <p className="text-sm font-medium text-muted-foreground">
        {t("welcomeTo")}
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight wrap-break-word">
        {name}
      </h1>
    </div>
  );
}
