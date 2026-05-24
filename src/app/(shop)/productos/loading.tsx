export default function Loading() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="h-8 w-40 animate-pulse rounded bg-ink/10" />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
          >
            <div className="aspect-square animate-pulse bg-ink/5" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
