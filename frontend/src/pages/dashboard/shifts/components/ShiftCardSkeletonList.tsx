import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShiftCardSkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card
          key={index}
          className="flex flex-row items-center justify-between gap-4 p-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-5 w-20 rounded-full" />
        </Card>
      ))}
    </div>
  );
}
