export default function NoShift() {
  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-muted-foreground/50" />
        Closed
      </span>
      <p className="mt-4 max-w-xs text-sm text-muted-foreground">
        This stall isn't taking orders right now. Check back when they're open to
        track your place in line.
      </p>
    </div>
  );
}
