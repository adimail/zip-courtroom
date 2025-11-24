"use client";

import { MatchResult } from "@/lib/courtroom";
import { VerdictBanner } from "./VerdictBanner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StandaloneVerdictProps {
  match: MatchResult;
}

export function StandaloneVerdict({ match }: StandaloneVerdictProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EBE8E1] p-4">
      <div className="mb-6 w-full max-w-3xl">
        <Link
          href="/"
          className="mb-4 flex w-fit items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase transition-colors hover:text-[#1C1C1C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Court
        </Link>
        <VerdictBanner match={match} />

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          <StatCard label="Winner Time" value={match.winnerTime ? `${match.winnerTime}s` : "N/A"} />
          <StatCard label="Loser Time" value={match.loserTime ? `${match.loserTime}s` : "DNF"} />
          <StatCard
            label="Time Diff"
            value={match.diff >= 0 ? `+${match.diff.toFixed(2)}s` : "-"}
          />
          <StatCard
            label="Win Streak"
            value={match.streak.toString()}
            highlighted={match.streak >= 2}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlighted,
}: {
  label: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`border p-2 ${
        highlighted ? "border-amber-600 bg-amber-100" : "border-[#1C1C1C] bg-[#F5F4F0]"
      }`}
    >
      <div className="mb-1 border-b border-slate-300 pb-0.5 text-[9px] font-bold tracking-widest text-slate-500 uppercase">
        {label}
      </div>
      <div
        className={`font-mono text-lg font-bold md:text-xl ${
          highlighted ? "text-amber-700" : "text-[#1C1C1C]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
