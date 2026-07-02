import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { RotateCw, TriangleAlert } from "lucide-react";
import { Navigate } from "react-router-dom";

export function QueryError({
  error,
  redirectOn404 = false,
  onRetry,
}: {
  error: unknown;
  redirectOn404?: boolean;
  onRetry?: () => void;
}) {
  if (
    redirectOn404 &&
    error instanceof AxiosError &&
    error.response?.status === 404
  ) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-60 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Something went wrong</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          We couldn't load this right now. Please try again.
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCw />
          Try again
        </Button>
      )}
    </div>
  );
}
