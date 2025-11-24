"use client";

import { useState, useEffect } from "react";
import { MatchResult } from "@/lib/courtroom";
import { VerdictBanner } from "@/components/courtroom/VerdictBanner";
import { MatchList } from "@/components/courtroom/MatchList";
import { Gavel, BarChart3 } from "lucide-react";
import Link from "next/link";

interface CourtroomClientProps {
  matches: MatchResult[];
}

export function CourtroomClient({ matches }: CourtroomClientProps) {
  const [selectedMatchId, setSelectedMatchId] = useState<number>(0);

  useEffect(() => {
    if (matches.length > 0) {
      setSelectedMatchId(matches[matches.length - 1].id);
    }
  }, [matches]);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  return (
    <div className="min-h-screen bg-[#EBE8E1] pb-10 font-sans text-[#1C1C1C]">
      <header className="sticky top-0 z-30 border-b-4 border-[#1C1C1C] bg-[#1C1C1C] py-4 text-[#EBE8E1] shadow-none md:py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-600 p-2">
              <Gavel className="h-6 w-6 text-[#1C1C1C] md:h-8 md:w-8" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wider uppercase md:text-4xl">
                ZIP COURTROOM
              </h1>
              <div className="my-1 h-0.5 w-full bg-amber-600"></div>
              <p className="hidden text-[10px] tracking-[0.2em] text-amber-500 uppercase md:block md:text-xs">
                Official Judicial Records
              </p>
            </div>
          </div>

          <Link
            href="/stats"
            className="flex items-center gap-2 border-2 border-amber-600 bg-transparent px-4 py-2 text-xs font-bold text-amber-500 uppercase tracking-wider transition-colors hover:bg-amber-600 hover:text-[#1C1C1C] md:text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Statistics</span>
            <span className="md:hidden">Stats</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="order-1 h-fit lg:sticky lg:top-32 lg:col-span-8">
            {selectedMatch ? (
              <div className="space-y-6">
                <div className="flex flex-col justify-between border-b-2 border-[#1C1C1C] pb-2 md:flex-row md:items-end">
                  <h2 className="font-serif text-xl font-bold text-[#1C1C1C] md:text-2xl">
                    CASE #{selectedMatch.puzzleNo}: {selectedMatch.winner.toUpperCase()} v.{" "}
                    {selectedMatch.loser.toUpperCase()}
                  </h2>
                  <span className="font-mono text-xs font-bold text-slate-600 uppercase md:text-sm">
                    DOCKET DATE: {selectedMatch.date}
                  </span>
                </div>

                <VerdictBanner match={selectedMatch} />

                <div className="mt-4 grid grid-cols-2 gap-4 md:mt-8 md:grid-cols-4">
                  <StatCard
                    label="Winner Time"
                    value={selectedMatch.winnerTime ? `${selectedMatch.winnerTime}s` : "N/A"}
                  />
                  <StatCard
                    label="Loser Time"
                    value={selectedMatch.loserTime ? `${selectedMatch.loserTime}s` : "DNF"}
                  />
                  <StatCard
                    label="Time Diff"
                    value={selectedMatch.diff >= 0 ? `+${selectedMatch.diff.toFixed(2)}s` : "-"}
                  />
                  <StatCard
                    label="Win Streak"
                    value={selectedMatch.streak.toString()}
                    highlighted={selectedMatch.streak >= 2}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center border-2 border-dashed border-[#1C1C1C] bg-transparent md:h-96">
                <p className="font-serif text-lg text-[#1C1C1C]">No cases filed yet.</p>
              </div>
            )}
          </div>

          <div className="order-2 lg:col-span-4">
            <MatchList
              matches={matches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={(id) => {
                setSelectedMatchId(id);
                if (window.innerWidth < 1024) {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </div>
        </div>
      </main>
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
      className={`border-2 p-3 md:p-4 ${
        highlighted ? "border-amber-600 bg-amber-100" : "border-[#1C1C1C] bg-[#F5F4F0]"
      }`}
    >
      <div className="mb-2 border-b border-slate-300 pb-1 text-[10px] font-bold tracking-widest text-slate-500 uppercase md:text-xs">
        {label}
      </div>
      <div
        className={`font-mono text-xl font-bold md:text-3xl ${
          highlighted ? "text-amber-700" : "text-[#1C1C1C]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}