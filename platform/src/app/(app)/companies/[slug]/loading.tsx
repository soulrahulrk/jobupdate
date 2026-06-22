export default function Loading() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
      <div className="card mt-3 space-y-3">
        <div className="h-7 w-1/2 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="mt-2 h-16 w-full animate-pulse rounded bg-surface-2" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card h-32 animate-pulse" />
        <div className="card h-32 animate-pulse" />
      </div>
    </div>
  );
}
