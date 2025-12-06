import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton";
import { KpiGridSkeleton } from "@/components/skeletons/KpiGridSkeleton";
import { PlayerProfileSkeleton } from "@/components/skeletons/PlayerProfileSkeleton";

export default function StatsLoading() {
  return (
    <div className="min-h-screen bg-[#EBE8E1] pb-10 font-sans text-[#1C1C1C]">
      <HeaderSkeleton isStatsPage={true} />
      <main className="container mx-auto space-y-8 px-4 py-6 md:py-8">
        <KpiGridSkeleton />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ChartSkeleton />
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PlayerProfileSkeleton />
          <PlayerProfileSkeleton />
        </div>
      </main>
    </div>
  );
}
