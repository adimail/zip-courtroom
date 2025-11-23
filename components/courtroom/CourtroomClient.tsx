"use client";

import { useState, useEffect } from "react";
import { MatchResult } from "@/lib/courtroom";
import { VerdictBanner } from "@/components/courtroom/VerdictBanner";
import { MatchList } from "@/components/courtroom/MatchList";
import { Gavel } from "lucide-react";

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

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <header className="bg-slate-900 text-amber-50 border-b-4 border-amber-600 py-4 md:py-6 sticky top-0 z-20 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-1.5 md:p-2 rounded-lg">
              <Gavel className="w-6 h-6 md:w-8 md:h-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-serif font-bold tracking-tight">ZIP COURTROOM</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column: Verdict Display */}
          <div className="lg:col-span-8 order-1 lg:order-1">
            {selectedMatch ? (
              <div className="space-y-4 md:space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                    <h2 className="text-lg md:text-xl font-serif font-bold text-slate-800">
                      Puzzle #{selectedMatch.puzzleNo}: {selectedMatch.winner.toUpperCase()} vs {selectedMatch.loser.toUpperCase()}
                    </h2>
                    <span className="text-xs md:text-sm text-slate-500 font-mono">{selectedMatch.date}</span>
                 </div>
                 
                 <VerdictBanner match={selectedMatch} />

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-8">
                    <StatCard label="Winner Time" value={selectedMatch.winnerTime ? `${selectedMatch.winnerTime}s` : "N/A"} />
                    <StatCard label="Loser Time" value={selectedMatch.loserTime ? `${selectedMatch.loserTime}s` : "DNF"} />
                    <StatCard label="Diff" value={selectedMatch.diff >= 0 ? `+${selectedMatch.diff.toFixed(2)}s` : "-"} />
                    <StatCard label="Streak" value={selectedMatch.streak.toString()} highlighted={selectedMatch.streak >= 2} />
                 </div>
              </div>
            ) : (
              <div className="h-64 md:h-96 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">No cases filed yet.</p>
              </div>
            )}
          </div>

          {/* Right Column: List (Scrollable) */}
          <div className="lg:col-span-4 order-2 lg:order-2">
            <MatchList
              matches={matches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={(id) => {
                setSelectedMatchId(id);
                // On mobile, scroll to top to see verdict when clicking a list item
                if (window.innerWidth < 1024) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, highlighted }: { label: string, value: string, highlighted?: boolean }) {
  return (
    <div className={`bg-white p-3 md:p-4 rounded-lg border shadow-sm ${highlighted ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}>
      <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-lg md:text-2xl font-bold ${highlighted ? 'text-amber-700' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}