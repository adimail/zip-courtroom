import { VerdictBannerSkeleton } from "@/components/skeletons/VerdictBannerSkeleton";
import { ArrowLeft } from "lucide-react";

export default function CaseLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EBE8E1] p-4">
      <div className="mb-6 w-full max-w-3xl">
        <div className="mb-4 flex w-fit items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
          <ArrowLeft className="h-4 w-4" />
          Back to Court
        </div>

        <VerdictBannerSkeleton />

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
          <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
          <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
          <div className="h-20 animate-pulse rounded-none border border-[#1C1C1C] bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
