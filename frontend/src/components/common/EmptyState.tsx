export default function EmptyState({ message }: { message: string }) {
  return (
    <p className="py-16 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}
