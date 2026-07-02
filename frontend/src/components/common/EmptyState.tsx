export default function EmptyState({ label }: { label: string }) {
  return (
    <p className="py-16 text-center text-sm text-muted-foreground">
      No {label} yet.
    </p>
  );
}
