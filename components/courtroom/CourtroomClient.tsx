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

  // Set initial selected match to the latest one
  useEffect(() => {
    if (matches.length > 0) {
      setSelectedMatchId(matches[matches.length - 1].id);
    }
  }, [matches]);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  return (
    <div className="min-h-screen bg-slate-50 pb-10 font-sans text-slate-900">
      {/* Main Header - Sticky Top (z-30 to stay above everything) */}
      <header className="sticky top-0 z-30 border-b-4 border-amber-600 bg-slate-900 py-4 text-amber-50 shadow-md md:py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-600 p-1.5 md:p-2">
              <Gavel className="h-6 w-6 text-slate-900 md:h-8 md:w-8" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight md:text-3xl">
                ZIP COURTROOM
              </h1>
              <p className="hidden text-[10px] tracking-widest text-amber-500/80 uppercase md:block md:text-xs">
                Random Quote Generator System
              </p>
            </div>
          </div>

          <Link
            href="/stats"
            className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-amber-50 transition-colors hover:bg-slate-700 md:px-4 md:py-2 md:text-sm"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">View Statistics</span>
            <span className="md:hidden">Stats</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-12">
          {/* Left Column: Verdict Display */}
          {/* lg:sticky makes it stick on desktop. top-28 accounts for the main header height. */}
          <div className="order-1 h-fit lg:sticky lg:top-28 lg:order-1 lg:col-span-8">
            {selectedMatch ? (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col justify-between gap-1 md:flex-row md:items-center">
                  <h2 className="font-serif text-lg font-bold text-slate-800 md:text-xl">
                    Puzzle #{selectedMatch.puzzleNo}: {selectedMatch.winner.toUpperCase()} vs{" "}
                    {selectedMatch.loser.toUpperCase()}
                  </h2>
                  <span className="font-mono text-xs text-slate-500 md:text-sm">
                    {selectedMatch.date}
                  </span>
                </div>

                <VerdictBanner match={selectedMatch} />

                <div className="mt-4 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-4 md:gap-4">
                  <StatCard
                    label="Winner Time"
                    value={selectedMatch.winnerTime ? `${selectedMatch.winnerTime}s` : "N/A"}
                  />
                  <StatCard
                    label="Loser Time"
                    value={selectedMatch.loserTime ? `${selectedMatch.loserTime}s` : "DNF"}
                  />
                  <StatCard
                    label="Diff"
                    value={selectedMatch.diff >= 0 ? `+${selectedMatch.diff.toFixed(2)}s` : "-"}
                  />
                  <StatCard
                    label="Streak"
                    value={selectedMatch.streak.toString()}
                    highlighted={selectedMatch.streak >= 2}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-100 md:h-96">
                <p className="text-sm text-slate-500">No cases filed yet.</p>
              </div>
            )}
          </div>

          {/* Right Column: List */}
          <div className="order-2 lg:order-2 lg:col-span-4">
            <MatchList
              matches={matches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={(id) => {
                setSelectedMatchId(id);
                // On mobile, scroll to top to see verdict when clicking a list item
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
      className={`rounded-lg border bg-white p-3 shadow-sm md:p-4 ${highlighted ? "border-amber-500 bg-amber-50" : "border-slate-200"}`}
    >
      <div className="mb-1 text-[10px] tracking-wider text-slate-500 uppercase md:text-xs">
        {label}
      </div>
      <div
        className={`text-lg font-bold md:text-2xl ${highlighted ? "text-amber-700" : "text-slate-800"}`}
      >
        {value}
      </div>
    </div>
  );
}
