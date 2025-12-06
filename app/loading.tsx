import { HeaderSkeleton } from "@/components/skeletons/HeaderSkeleton";
import { MatchListSkeleton } from "@/components/skeletons/MatchListSkeleton";
import { VerdictBannerSkeleton } from "@/components/skeletons/VerdictBannerSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#EBE8E1] pb-8 font-sans text-[#1C1C1C]">
      <HeaderSkeleton />
      <main className="container mx-auto px-3 py-4 md:px-4 md:py-6">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="order-1 h-fit lg:sticky lg:top-24 lg:col-span-8">
            <div className="space-y-4">
              <div className="flex flex-col justify-between border-b border-[#1C1C1C] pb-1 md:flex-row md:items-end">
                <div className="h-6 w-3/4 animate-pulse bg-gray-300" />
                <div className="mt-1 h-4 w-1/4 animate-pulse bg-gray-300 md:mt-0" />
              </div>
              <VerdictBannerSkeleton />
              <div className="mt-2 grid grid-cols-2 gap-2 md:mt-4 md:grid-cols-4 md:gap-3">
                <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
                <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
                <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
                <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
              </div>
              <div className="flex gap-4">
                <div className="mt-3 h-8 w-36 animate-pulse bg-black/80" />
                <div className="mt-3 h-8 w-36 animate-pulse bg-black/80" />
              </div>
            </div>
          </div>
          <div className="order-2 lg:col-span-4">
            <MatchListSkeleton />
          </div>
        </div>
      </main>
    </div>
  );
}
