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
    <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0]">
      <div className="sticky top-[72px] z-20 border-b-2 border-[#1C1C1C] bg-[#1C1C1C] p-4 text-[#EBE8E1] md:top-[100px]">
        <h3 className="font-serif text-lg font-bold tracking-wide uppercase">
          Court Dockets
        </h3>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Select a case file
        </p>
      </div>

      <div className="divide-y-2 divide-[#1C1C1C]">
        {reversedMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match.id)}
            className={cn(
              "group flex w-full cursor-pointer flex-col gap-2 p-4 text-left transition-colors",
              selectedMatchId === match.id
                ? "bg-[#525252] text-[#f7f0e1]"
                : "bg-[#F5F4F0] text-[#1C1C1C] hover:bg-[#e0ded5]"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
                    selectedMatchId === match.id ? "text-amber-500" : "text-slate-600"
                  )}
                >
                  CASE #{match.puzzleNo}
                </span>
              </div>
              <div className="flex gap-2">
                {match.prize && (
                  <span className="flex items-center gap-1 border border-amber-600 px-1 text-[9px] font-bold text-amber-600 uppercase bg-amber-100">
                    <Gift className="h-3 w-3" /> PRIZE
                  </span>
                )}
                {match.isNewRecord && (
                  <span className="border border-amber-500 bg-amber-500 px-1 text-[9px] font-bold text-[#1C1C1C] uppercase">
                    RECORD
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy
                  className={cn(
                    "h-4 w-4",
                    selectedMatchId === match.id
                      ? "text-amber-500"
                      : match.winner === "aditya"
                      ? "text-indigo-700"
                      : "text-emerald-700"
                  )}
                />
                <span className="font-serif text-lg font-bold uppercase">
                  {match.winner}
                </span>
                <span
                  className={cn(
                    "text-xs uppercase",
                    selectedMatchId === match.id ? "text-gray-300" : "text-gray-400"
                  )}
                >
                  def.
                </span>
                <span
                  className={cn(
                    "text-sm uppercase line-through decoration-2",
                    selectedMatchId === match.id
                      ? "text-gray-300 decoration-gray-300"
                      : "text-gray-400 decoration-gray-400"
                  )}
                >
                  {match.loser}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-sm">
                <Timer className="h-3 w-3" />
                <span>
                  {match.winnerTime !== null ? `${match.winnerTime}s` : "N/A"}
                </span>
              </div>
            </div>

            <div
              className={cn(
                "mt-1 flex items-center justify-between border-t pt-2 text-[10px] uppercase tracking-wider",
                selectedMatchId === match.id
                  ? "border-gray-700 text-gray-400"
                  : "border-gray-300 text-gray-300"
              )}
            >
              <span className={cn(
                    "flex items-center gap-1",
                    selectedMatchId === match.id ? "text-gray-200" : "text-gray-500"
                  )}>
                <Calendar className="h-3 w-3" /> {match.date}
              </span>
              {match.streak >= 2 && (
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Flame className="h-3 w-3" />
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