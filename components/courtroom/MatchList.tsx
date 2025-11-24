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
    <div className="bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
      <div className="p-3 md:p-4 bg-slate-100 border-b border-slate-200 sticky top-[72px] md:top-[100px] z-20 rounded-t-lg shadow-sm">
        <h3 className="font-serif font-bold text-slate-700 text-base md:text-lg flex items-center gap-2">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          Court Dockets
        </h3>
        <p className="text-[10px] md:text-xs text-slate-500">Select a case to view the full verdict</p>
      </div>
      
      <div className="divide-y divide-slate-200">
        {reversedMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => onSelectMatch(match.id)}
            className={cn(
              "w-full text-left p-3 md:p-4 hover:bg-slate-100 transition-colors flex flex-col gap-1.5 md:gap-2 group cursor-pointer",
              selectedMatchId === match.id ? "bg-amber-50 border-l-4 border-amber-500" : "border-l-4 border-transparent"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] md:text-xs text-slate-500 font-bold">#{match.puzzleNo}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {match.date}
                </span>
              </div>
              {match.isNewRecord && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 text-[9px] md:text-[10px] px-1 py-0">
                  RECORD
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-0.5">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Trophy className={cn("w-3 h-3 md:w-4 md:h-4", match.winner === 'aditya' ? "text-indigo-600" : match.winner === 'mahi' ? "text-emerald-600" : "text-slate-400")} />
                <span className="font-bold text-slate-800 capitalize text-sm md:text-base">{match.winner}</span>
                <span className="text-slate-400 text-[10px] md:text-xs">def.</span>
                <span className="text-slate-500 capitalize decoration-slate-400 line-through text-xs md:text-sm">{match.loser}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 font-mono text-xs md:text-sm">
                <Timer className="w-3 h-3" />
                <span>{match.winnerTime !== null ? `${match.winnerTime}s` : "N/A"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-500 mt-0.5">
              <span className={cn("flex items-center gap-1", match.streak >= 2 ? "text-orange-600 font-bold" : "")}>
                <Flame className="w-3 h-3" />
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