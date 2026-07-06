import { fmtTime } from "@/lib/dateFormat";

export default function LiveIndicator({
  isActive,
  createdAt,
}: {
  isActive: boolean;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {isActive && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Updating live
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Placed at {fmtTime(createdAt)}
      </p>
    </div>
  );
}
