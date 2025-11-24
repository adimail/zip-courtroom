import { MatchResult } from "../../lib/courtroom";
import { cn } from "../../lib/utils";
import { Trophy, Timer, Flame, Calendar, Gift } from "lucide-react";

interface MatchListProps {
  matches: MatchResult[];
  selectedMatchId: number;
  onSelectMatch: (id: number) => void;
}

export function MatchList({ matches, selectedMatchId, onSelectMatch }: MatchListProps) {
  const reversedMatches = [...matches].reverse();

  return (
    <div className="border border-[#1C1C1C] bg-[#F5F4F0]">
      <div className="sticky top-[60px] z-20 border-b border-[#1C1C1C] bg-[#454545] p-3 text-[#EBE8E1] md:top-[70px]">
        <h3 className="font-serif text-sm font-bold tracking-wide uppercase">Court Dockets</h3>
        <p className="text-[9px] tracking-wider text-gray-400 uppercase">Select a case file</p>
      </div>

      <div className="divide-y divide-[#1C1C1C]">
        {reversedMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match.id)}
            className={cn(
              "group flex w-full cursor-pointer flex-col gap-1.5 p-3 text-left transition-colors",
              selectedMatchId === match.id
                ? "bg-[#1C1C1C] text-[#EBE8E1]"
                : "bg-[#F5F4F0] text-[#1C1C1C] hover:bg-[#e0ded5]"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold",
                    selectedMatchId === match.id ? "text-amber-500" : "text-slate-600"
                  )}
                >
                  #{match.puzzleNo}
                </span>
              </div>
              <div className="flex gap-1.5">
                {match.prize && (
                  <span className="flex items-center gap-0.5 border border-amber-600 bg-amber-100 px-1 text-[8px] font-bold text-amber-600 uppercase">
                    <Gift className="h-2.5 w-2.5" /> PRIZE
                  </span>
                )}
                {match.isNewRecord && (
                  <span className="border border-amber-500 bg-amber-500 px-1 text-[8px] font-bold text-[#1C1C1C] uppercase">
                    RECORD
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Trophy
                  className={cn(
                    "h-3.5 w-3.5",
                    selectedMatchId === match.id
                      ? "text-amber-500"
                      : match.winner === "aditya"
                        ? "text-indigo-700"
                        : "text-emerald-700"
                  )}
                />
                <span className="font-serif text-sm font-bold uppercase">{match.winner}</span>
                <span
                  className={cn(
                    "text-[10px] uppercase",
                    selectedMatchId === match.id ? "text-gray-500" : "text-gray-400"
                  )}
                >
                  def.
                </span>
                <span
                  className={cn(
                    "text-xs uppercase line-through decoration-1",
                    selectedMatchId === match.id
                      ? "text-gray-500 decoration-gray-500"
                      : "text-gray-400 decoration-gray-400"
                  )}
                >
                  {match.loser}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                <Timer className="h-3 w-3" />
                <span>{match.winnerTime !== null ? `${match.winnerTime}s` : "N/A"}</span>
              </div>
            </div>

            <div
              className={cn(
                "mt-0.5 flex items-center justify-between border-t pt-1.5 text-[9px] tracking-wider uppercase",
                selectedMatchId === match.id
                  ? "border-gray-700 text-gray-400"
                  : "border-gray-300 text-gray-500"
              )}
            >
              <span className="flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" /> {match.date}
              </span>
              {match.streak >= 2 && (
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Flame className="h-2.5 w-2.5" />
                  Streak: {match.streak}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
