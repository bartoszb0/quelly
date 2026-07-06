import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/OrderStatus";
import { Fragment } from "react";

const STEPS = ["Queued", "Ready", "Collected"] as const;
const STEP_INDEX: Record<OrderStatus, number> = {
  QUEUED: 0,
  READY: 1,
  COLLECTED: 2,
  CANCELLED: -1,
};

export default function OrderProgress({ status }: { status: OrderStatus }) {
  const currentStep = STEP_INDEX[status];

  // Hidden for the cancelled (off-path) state.
  if (currentStep < 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <Fragment key={label}>
            <div
              className={cn(
                "size-3 shrink-0 rounded-full transition-colors",
                i <= currentStep ? "bg-primary" : "bg-muted",
              )}
            />
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors",
                  i < currentStep ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </Fragment>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={cn(
              i <= currentStep
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
