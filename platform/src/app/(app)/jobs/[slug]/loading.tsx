export default function Loading() {
  return (
    <div className="container max-w-3xl py-8">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />
      <div className="card mt-3 space-y-3">
        <div className="h-7 w-2/3 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-surface-2" />
        <div className="mt-2 h-24 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-10 w-40 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
