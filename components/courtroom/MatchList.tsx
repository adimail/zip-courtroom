import { MatchResult } from "../../lib/courtroom";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { Trophy, Timer, TrendingUp, Flame, Calendar } from "lucide-react";

interface MatchListProps {
  matches: MatchResult[];
  selectedMatchId: number;
  onSelectMatch: (id: number) => void;
}

export function MatchList({ matches, selectedMatchId, onSelectMatch }: MatchListProps) {
  const reversedMatches = [...matches].reverse();

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <div className="sticky top-[72px] z-20 rounded-t-lg border-b border-slate-200 bg-slate-100 p-3 shadow-sm md:top-[100px] md:p-4">
        <h3 className="flex items-center gap-2 font-serif text-base font-bold text-slate-700 md:text-lg">
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
          Court Dockets
        </h3>
        <p className="text-[10px] text-slate-500 md:text-xs">
          Select a case to view the full verdict
        </p>
      </div>

      <div className="divide-y divide-slate-200">
        {reversedMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match.id)}
            className={cn(
              "group flex w-full cursor-pointer flex-col gap-1.5 p-3 text-left transition-colors hover:bg-slate-100 md:gap-2 md:p-4",
              selectedMatchId === match.id
                ? "border-l-4 border-amber-500 bg-amber-50"
                : "border-l-4 border-transparent"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 md:text-xs">
                  #{match.puzzleNo}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Calendar className="h-3 w-3" /> {match.date}
                </span>
              </div>
              {match.isNewRecord && (
                <Badge
                  variant="secondary"
                  className="border-amber-200 bg-amber-100 px-1 py-0 text-[9px] text-amber-800 hover:bg-amber-200 md:text-[10px]"
                >
                  RECORD
                </Badge>
              )}
            </div>

            <div className="mt-0.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Trophy
                  className={cn(
                    "h-3 w-3 md:h-4 md:w-4",
                    match.winner === "aditya"
                      ? "text-indigo-600"
                      : match.winner === "mahi"
                        ? "text-emerald-600"
                        : "text-slate-400"
                  )}
                />
                <span className="text-sm font-bold text-slate-800 capitalize md:text-base">
                  {match.winner}
                </span>
                <span className="text-[10px] text-slate-400 md:text-xs">def.</span>
                <span className="text-xs text-slate-500 capitalize line-through decoration-slate-400 md:text-sm">
                  {match.loser}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-slate-600 md:text-sm">
                <Timer className="h-3 w-3" />
                <span>{match.winnerTime !== null ? `${match.winnerTime}s` : "N/A"}</span>
              </div>
            </div>

            <div className="mt-0.5 flex items-center gap-3 text-[10px] text-slate-500 md:text-xs">
              <span
                className={cn(
                  "flex items-center gap-1",
                  match.streak >= 2 ? "font-bold text-orange-600" : ""
                )}
              >
                <Flame className="h-3 w-3" />
                Streak: {match.streak}
              </span>
              <span>Diff: {match.diff >= 0 ? `+${match.diff.toFixed(2)}s` : "DNF"}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
