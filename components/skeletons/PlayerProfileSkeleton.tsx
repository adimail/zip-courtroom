export function PlayerProfileSkeleton() {
  return (
    <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-6">
      <div className="mb-4 h-6 w-40 animate-pulse bg-gray-300" />
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-300 pb-2">
          <div className="h-4 w-24 animate-pulse bg-gray-300" />
          <div className="h-4 w-16 animate-pulse bg-gray-300" />
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-2">
          <div className="h-4 w-28 animate-pulse bg-gray-300" />
          <div className="h-4 w-12 animate-pulse bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
