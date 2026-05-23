export function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="aspect-square skeleton rounded-xl bg-slate-200/50" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 skeleton rounded bg-slate-200/50" />
        <div className="h-3 w-1/2 skeleton rounded bg-slate-200/50" />
        <div className="h-5 w-1/3 skeleton rounded bg-slate-200/50" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
