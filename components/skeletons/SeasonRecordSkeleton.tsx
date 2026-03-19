export function SeasonRecordSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between sm:mb-3">
        <div className="h-4 w-28 animate-pulse bg-gray-300 sm:h-5 sm:w-32 md:h-6" />
        <div className="h-3 w-20 animate-pulse bg-gray-300 sm:h-4 sm:w-24" />
      </div>

      <div className="border-2 border-[#1C1C1C] bg-[#2A2A2A] p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-1 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-sm bg-[#404040] sm:h-10 sm:w-10 md:h-12 md:w-12" />
            <div className="min-w-0 space-y-1.5 sm:space-y-2">
              <div className="h-3 w-12 animate-pulse bg-[#404040] sm:h-5 sm:w-16 md:w-20" />
              <div className="h-2 w-16 animate-pulse bg-[#404040] sm:h-3 sm:w-20 md:w-24" />
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center space-y-1.5 px-1 sm:space-y-2 sm:px-2">
            <div className="h-2 w-4 animate-pulse bg-[#404040] sm:h-3 sm:w-6" />
            <div className="flex gap-0.5 sm:gap-1 md:gap-1.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse rounded-sm bg-[#404040] sm:h-2 sm:w-2 md:h-2.5 md:w-2.5"
                />
              ))}
            </div>
            <div className="h-1.5 w-8 animate-pulse bg-[#404040] sm:h-2 sm:w-10" />
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right sm:gap-3">
            <div className="flex min-w-0 flex-col items-end space-y-1.5 sm:space-y-2">
              <div className="h-3 w-12 animate-pulse bg-[#404040] sm:h-5 sm:w-16 md:w-20" />
              <div className="h-2 w-16 animate-pulse bg-[#404040] sm:h-3 sm:w-20 md:w-24" />
            </div>
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-sm bg-[#404040] sm:h-10 sm:w-10 md:h-12 md:w-12" />
          </div>
        </div>

        <div className="mt-5 mb-2.5 h-1.5 w-full animate-pulse overflow-hidden rounded-sm bg-[#404040] sm:mt-6 sm:mb-3 sm:h-2 md:h-2.5" />

        <div className="flex items-center justify-between">
          <div className="h-3 w-16 animate-pulse bg-[#404040] sm:h-4 sm:w-24" />
          <div className="h-3 w-12 animate-pulse bg-[#404040] sm:h-4 sm:w-16" />
          <div className="h-3 w-16 animate-pulse bg-[#404040] sm:h-4 sm:w-24" />
        </div>
      </div>
    </div>
  );
}
