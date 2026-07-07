import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function BackBtn({
  label,
  className,
  to,
}: {
  label?: string;
  className?: string;
  to?: string;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { shopId } = useParams();

  // Default target is the shop's own page; callers can override with `to`.
  const target = to ?? (shopId ? `/dashboard/shop/${shopId}` : "/dashboard");

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("text-muted-foreground", className)}
      onClick={() => navigate(target)}
    >
      <ArrowLeft />
      {label ?? t("back")}
    </Button>
  );
}
