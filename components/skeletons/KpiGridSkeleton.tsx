export function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex h-full min-h-[90px] flex-col justify-between border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4"
        >
          <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2">
            <div className="h-3 w-20 animate-pulse bg-gray-300" />
            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-300" />
          </div>
          <div className="h-8 w-24 animate-pulse bg-gray-300" />
        </div>
      ))}
    </div>
  );
}
