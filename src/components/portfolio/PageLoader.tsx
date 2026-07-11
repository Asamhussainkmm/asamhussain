export function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-sm text-muted-foreground font-mono">
          asam<span className="text-primary">.</span>
        </span>
      </div>
    </div>
  );
}
