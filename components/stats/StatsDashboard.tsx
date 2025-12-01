"use client";

import { MatchResult, CourtStats, RawData } from "@/lib/courtroom";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KpiGrid } from "./components/KpiGrid";
import { WinDistributionChart } from "./components/WinDistributionChart";
import { TimeDifferenceChart } from "./components/TimeDifferenceChart";
import { VictoryCalendar } from "./components/VictoryCalendar";
import { ResponseTimeChart } from "./components/ResponseTimeChart";
import { PlayerProfile } from "./components/PlayerProfile";

interface StatsDashboardProps {
  matches: MatchResult[];
  stats: CourtStats;
  rawData: RawData;
}

export function StatsDashboard({ matches, stats, rawData }: StatsDashboardProps) {
  const [hoveredMatch, setHoveredMatch] = useState<MatchResult | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleDayHover = (match: MatchResult | null, position: { x: number; y: number }) => {
    setHoveredMatch(match);
    setHoverPosition(position);
  };

  return (
    <div className="min-h-screen bg-[#EBE8E1] pb-10 font-sans text-[#1C1C1C]">
      {hoveredMatch && (
        <div
          className="pointer-events-none fixed z-50 -translate-y-full transform space-y-0.5 rounded-none border-2 border-amber-600 bg-[#1C1C1C] p-2 text-xs text-[#EBE8E1] shadow-lg"
          style={{
            left: `${hoverPosition.x + 15}px`,
            top: `${hoverPosition.y - 15}px`,
          }}
        >
          <p className="font-mono font-bold tracking-wider text-amber-500 uppercase">
            Case #{hoveredMatch.puzzleNo}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Winner:</span>{" "}
            <span className="uppercase">{hoveredMatch.winner}</span>
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Time:</span>{" "}
            {hoveredMatch.winnerTime ? `${hoveredMatch.winnerTime}s` : "N/A"}
          </p>
        </div>
      )}
      <header className="sticky top-0 z-30 border-b-4 border-[#1C1C1C] bg-[#1C1C1C] py-4 text-[#EBE8E1] shadow-none md:py-6">
        <div className="container mx-auto flex items-center gap-4 px-4">
          <Link
            href="/"
            className="border border-gray-600 p-2 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider uppercase md:text-3xl">
              COURT STATISTICS
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-amber-500 uppercase md:text-xs">
              Performance Analytics
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-6 md:py-8">
        <KpiGrid stats={stats} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <WinDistributionChart stats={stats} />
          <TimeDifferenceChart matches={matches} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <VictoryCalendar matches={matches} onDayHover={handleDayHover} />
          <ResponseTimeChart rawData={rawData} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PlayerProfile stats={stats} player="aditya" />
          <PlayerProfile stats={stats} player="mahi" />
        </div>
      </main>
    </div>
  );
}
