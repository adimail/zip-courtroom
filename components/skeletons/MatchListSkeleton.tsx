export function MatchListSkeleton() {
  return (
    <div className="border border-[#1C1C1C] bg-[#F5F4F0]">
      <div className="sticky top-[60px] z-20 border-b border-[#1C1C1C] bg-[#454545] p-3 text-[#EBE8E1] md:top-[70px]">
        <div className="mb-1 h-4 w-32 animate-pulse bg-gray-500" />
        <div className="h-2 w-24 animate-pulse bg-gray-500" />
      </div>
      <div className="divide-y divide-[#1C1C1C]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex w-full flex-col gap-1.5 p-3">
            <div className="flex w-full items-center justify-between">
              <div className="h-3 w-12 animate-pulse bg-gray-300" />
              <div className="h-3 w-10 animate-pulse bg-gray-300" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 animate-pulse bg-gray-300" />
              <div className="h-4 w-16 animate-pulse bg-gray-300" />
            </div>
            <div className="mt-0.5 flex items-center justify-between border-t border-gray-300 pt-1.5">
              <div className="h-3 w-24 animate-pulse bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
