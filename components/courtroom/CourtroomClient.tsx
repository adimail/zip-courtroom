"use client";

import { useState, useEffect, useCallback } from "react";
import { MatchResult } from "@/lib/courtroom";
import { VerdictBanner } from "@/components/courtroom/VerdictBanner";
import { MatchList } from "@/components/courtroom/MatchList";
import { Gavel, BarChart3, Share2, BookOpen } from "lucide-react";
import Link from "next/link";

interface CourtroomClientProps {
  matches: MatchResult[];
}

export function CourtroomClient({ matches }: CourtroomClientProps) {
  const lastMatchId = matches[matches.length - 1]?.id ?? 0;
  const [selectedMatchId, setSelectedMatchId] = useState(lastMatchId);

  useEffect(() => {
    setSelectedMatchId(lastMatchId);
  }, [lastMatchId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMatchId((prev) => {
          const nextId = prev + 1;
          return nextId < matches.length ? nextId : prev;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMatchId((prev) => {
          const prevId = prev - 1;
          return prevId >= 0 ? prevId : prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [matches.length]);

  const selectedMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined" || !selectedMatch) return;

    const url = `${window.location.origin}/case/${selectedMatch.puzzleNo}`;
    const title = `Case #${selectedMatch.puzzleNo}: ${selectedMatch.winner.toUpperCase()} vs ${selectedMatch.loser.toUpperCase()}`;
    const text = `Official Verdict for Case #${selectedMatch.puzzleNo}.\nWinner: ${selectedMatch.winner.toUpperCase()} (${selectedMatch.winnerTime}s)\n\nRead the full judgment here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  }, [selectedMatch]);

  const getMatchTitle = (match: MatchResult) => {
    if (!match) return "";
    switch (match.winner) {
      case "aditya":
      case "mahi":
        return `CASE #${match.puzzleNo}: ${match.winner.toUpperCase()} v. ${match.loser.toUpperCase()}`;
      case "tie":
        return `CASE #${match.puzzleNo}: TIE`;
      case "draw":
        return `CASE #${match.puzzleNo}: DRAW`;
      default:
        return `CASE #${match.puzzleNo}`;
    }
  };
  const matchTitle = getMatchTitle(selectedMatch);

  return (
    <div className="min-h-screen bg-[#EBE8E1] pb-8 font-sans text-[#1C1C1C]">
      <header className="sticky top-0 z-30 border-b-2 border-[#1C1C1C] bg-[#1C1C1C] py-2 text-[#EBE8E1] shadow-sm md:py-3">
        <div className="container mx-auto flex items-center justify-between px-3 md:px-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-1.5">
              <Gavel className="h-4 w-4 text-[#1C1C1C] md:h-5 md:w-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wider uppercase md:text-xl">
                ZIP COURTROOM
              </h1>
              <div className="my-0.5 h-px w-full bg-amber-600"></div>
              <p className="hidden text-[9px] tracking-[0.2em] text-amber-500 uppercase md:block">
                Official Judicial Records
              </p>
            </div>
          </div>

          <Link
            href="/stats"
            className="flex items-center gap-1.5 border border-amber-600 bg-transparent px-3 py-1.5 text-[10px] font-bold tracking-wider text-amber-500 uppercase transition-colors hover:bg-amber-600 hover:text-[#1C1C1C] md:text-xs"
          >
            <BarChart3 className="h-3 w-3" />
            <span>Stats</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-3 py-4 md:px-4 md:py-6">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="order-1 h-fit lg:sticky lg:top-24 lg:col-span-8">
            {selectedMatch ? (
              <div className="space-y-4">
                <div className="flex flex-col justify-between border-b border-[#1C1C1C] pb-1 md:flex-row md:items-end">
                  <h2 className="font-serif text-sm font-bold text-[#1C1C1C] md:text-base">
                    {matchTitle}
                  </h2>
                  <span className="font-mono text-[10px] font-bold text-slate-600 uppercase md:text-xs">
                    {selectedMatch.date}
                  </span>
                </div>

                <VerdictBanner match={selectedMatch} />

                <div className="mt-2 grid grid-cols-2 gap-2 md:mt-4 md:grid-cols-4 md:gap-3">
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

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="flex cursor-pointer items-center gap-1.5 border border-amber-600 bg-black/80 px-3 py-1.5 text-[10px] font-bold tracking-wider text-amber-500 uppercase transition-colors hover:bg-amber-600 hover:text-[#1C1C1C]"
                  >
                    <Share2 className="h-3 w-3" />
                    Share Verdict
                  </button>
                  <Link
                    href={`/case/${selectedMatch.puzzleNo}`}
                    className="flex cursor-pointer items-center gap-1.5 border border-amber-600 bg-black/80 px-3 py-1.5 text-[10px] font-bold tracking-wider text-amber-500 uppercase transition-colors hover:bg-amber-600 hover:text-[#1C1C1C]"
                  >
                    <BookOpen className="h-3 w-3" />
                    Open Verdict
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center border border-dashed border-[#1C1C1C] bg-transparent">
                <p className="font-serif text-sm text-[#1C1C1C]">No cases filed yet.</p>
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
