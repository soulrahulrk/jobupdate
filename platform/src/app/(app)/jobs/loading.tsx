export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-surface-2" />
      <div className="mb-4 h-10 w-full animate-pulse rounded bg-surface-2" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-40 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
