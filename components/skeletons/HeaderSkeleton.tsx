import { Gavel, BarChart3, ArrowLeft } from "lucide-react";

export function HeaderSkeleton({ isStatsPage = false }: { isStatsPage?: boolean }) {
  if (isStatsPage) {
    return (
      <header className="sticky top-0 z-30 border-b-4 border-[#1C1C1C] bg-[#1C1C1C] py-4 text-[#EBE8E1] shadow-none md:py-6">
        <div className="container mx-auto flex items-center gap-4 px-4">
          <div className="border border-gray-600 p-2">
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <div>
            <div className="mb-1 h-7 w-64 animate-pulse bg-gray-700" />
            <div className="h-4 w-48 animate-pulse bg-gray-700" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b-2 border-[#1C1C1C] bg-[#1C1C1C] py-2 text-[#EBE8E1] shadow-sm md:py-3">
      <div className="container mx-auto flex items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 p-1.5">
            <Gavel className="h-4 w-4 text-[#1C1C1C] md:h-5 md:w-5" />
          </div>
          <div>
            <div className="mb-1 h-5 w-40 animate-pulse bg-gray-700 md:h-6" />
            <div className="my-0.5 h-px w-full bg-amber-600"></div>
            <div className="hidden h-2 w-32 animate-pulse bg-gray-700 md:block" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 border border-amber-600 bg-transparent px-3 py-1.5 text-[10px] font-bold tracking-wider text-amber-500 uppercase md:text-xs">
          <BarChart3 className="h-3 w-3" />
          <span>Stats</span>
        </div>
      </div>
    </header>
  );
}
