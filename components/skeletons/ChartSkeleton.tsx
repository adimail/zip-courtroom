export function ChartSkeleton() {
  return (
    <div className="h-full min-h-[300px] w-full border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4 md:p-6">
      <div className="mb-6 border-b border-gray-300 pb-2">
        <div className="h-6 w-3/5 animate-pulse bg-gray-300" />
        <div className="mt-2 h-4 w-4/5 animate-pulse bg-gray-300" />
      </div>
      <div className="h-[250px] w-full animate-pulse bg-gray-200" />
    </div>
  );
}
