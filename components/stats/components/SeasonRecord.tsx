"use client";

import { CourtStats, MatchResult } from "@/lib/courtroom";
import { cn } from "@/lib/utils";

interface SeasonRecordProps {
  stats: CourtStats;
  matches: MatchResult[];
}

export function SeasonRecord({ stats, matches }: SeasonRecordProps) {
  const totalCases = stats.totalGames;
  const adityaWins = stats.adityaWins;
  const mahiWins = stats.mahiWins;
  const ties = stats.ties + stats.draws;

  const adityaPct = totalCases > 0 ? Math.round((adityaWins / totalCases) * 100) : 0;
  const mahiPct = totalCases > 0 ? Math.round((mahiWins / totalCases) * 100) : 0;
  const tiesPct = totalCases > 0 ? Math.round((ties / totalCases) * 100) : 0;

  const recentMatches = matches.slice(-7);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-end justify-between text-[#1C1C1C] sm:mb-3">
        <span className="font-serif text-[11px] font-bold tracking-[0.15em] uppercase sm:text-sm md:text-base">
          Season Record
        </span>
        <span className="text-[9px] tracking-wider text-gray-600 uppercase sm:text-xs md:text-sm">
          {totalCases} cases filed
        </span>
      </div>

      <div className="border-2 border-[#1C1C1C] bg-[#2A2A2A] p-3 text-[#EBE8E1] sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-1 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#4f46e5]/20 text-[10px] font-bold text-[#818cf8] sm:h-10 sm:w-10 sm:text-sm md:h-12 md:w-12 md:text-lg">
              AD
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xs font-bold text-white sm:text-base md:text-xl">
                Aditya
              </h3>
              <p className="truncate text-[9px] text-[#A3A3A3] sm:text-xs md:text-sm">
                The Director
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center px-1 sm:px-2">
            <span className="mb-1 text-[8px] font-bold tracking-widest text-[#737373] uppercase sm:text-[10px] md:text-xs">
              VS
            </span>
            <div className="flex gap-0.5 sm:gap-1 md:gap-1.5">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className={cn(
                    "h-1.5 w-1.5 rounded-sm sm:h-2 sm:w-2 md:h-2.5 md:w-2.5",
                    match.winner === "aditya" && "bg-[#4f46e5]",
                    match.winner === "mahi" && "bg-[#10b981]",
                    (match.winner === "tie" || match.winner === "draw") && "bg-[#94a3b8]"
                  )}
                />
              ))}
            </div>
            <span className="mt-1 text-[7px] tracking-widest text-[#A3A3A3] uppercase sm:text-[9px] md:text-[10px]">
              last {recentMatches.length}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 text-right sm:gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-xs font-bold text-white sm:text-base md:text-xl">
                Mahi
              </h3>
              <p className="truncate text-[9px] text-[#A3A3A3] sm:text-xs md:text-sm">
                The Documentation Head
              </p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-[#10b981]/20 text-[10px] font-bold text-[#34d399] sm:h-10 sm:w-10 sm:text-sm md:h-12 md:w-12 md:text-lg">
              MH
            </div>
          </div>
        </div>

        <div className="mt-5 mb-2.5 flex h-1.5 w-full overflow-hidden rounded-sm bg-[#404040] sm:mt-6 sm:mb-3 sm:h-2 md:h-2.5">
          <div className="bg-[#4f46e5]" style={{ width: `${adityaPct}%` }} />
          <div className="bg-[#94a3b8]" style={{ width: `${tiesPct}%` }} />
          <div className="bg-[#10b981]" style={{ width: `${mahiPct}%` }} />
        </div>

        <div className="flex items-center justify-between text-[9px] sm:text-xs md:text-sm">
          <div className="font-bold">
            <span className="text-[#818cf8]">{adityaWins} wins</span>
            <span className="text-[#A3A3A3]"> · {adityaPct}%</span>
          </div>
          <div className="font-mono text-[#A3A3A3]">{ties} ties</div>
          <div className="text-right font-bold">
            <span className="text-[#34d399]">{mahiWins} wins</span>
            <span className="text-[#A3A3A3]"> · {mahiPct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
