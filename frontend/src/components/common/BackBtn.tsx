import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function BackBtn({
  label = "Back",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const { shopId } = useParams();

  const to = shopId ? `/dashboard/shop/${shopId}` : "/dashboard";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("text-muted-foreground", className)}
      onClick={() => navigate(to)}
    >
      <ArrowLeft />
      {label}
    </Button>
  );
}
