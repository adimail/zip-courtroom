export function VerdictBannerSkeleton() {
  return (
    <div className="relative w-full overflow-hidden border-2 border-[#1C1C1C] bg-[#1C1C1C] p-1 shadow-lg">
      <div className="relative z-10 flex min-h-[400px] flex-col border-2 border-double border-[#EBE8E1]/30 p-6 text-[#EBE8E1] md:p-10">
        <div className="mb-6 flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-700" />
          <div className="h-4 w-64 animate-pulse bg-gray-700" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 text-center">
          <div className="h-8 w-full max-w-lg animate-pulse bg-gray-700" />
          <div className="h-6 w-full max-w-md animate-pulse bg-gray-700" />
          <div className="mx-auto w-full max-w-2xl border-t border-b border-[#EBE8E1]/20 py-4">
            <div className="h-5 w-full max-w-sm animate-pulse bg-gray-700" />
          </div>
        </div>
        <div className="mt-8 flex items-end justify-between border-t border-gray-800 pt-3">
          <div className="h-3 w-32 animate-pulse bg-gray-700" />
          <div className="h-3 w-24 animate-pulse bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
