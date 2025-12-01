import { CourtStats } from "@/lib/courtroom";
import { KpiCard } from "./KpiCard";
import { Scale, Trophy, Timer, Zap, Clock } from "lucide-react";

interface KpiGridProps {
  stats: CourtStats;
}

export function KpiGrid({ stats }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        title="Total Cases"
        value={stats.totalGames.toString()}
        icon={<Scale className="h-5 w-5 text-gray-600" />}
      />
      <KpiCard
        title="Aditya Wins"
        value={stats.adityaWins.toString()}
        subValue={`${
          stats.totalGames > 0
            ? ((stats.adityaWins / (stats.totalGames - stats.draws - stats.ties)) * 100).toFixed(0)
            : 0
        }%`}
        icon={<Trophy className="h-5 w-5 text-indigo-600" />}
        highlight="indigo"
      />
      <KpiCard
        title="Mahi Wins"
        value={stats.mahiWins.toString()}
        subValue={`${
          stats.totalGames > 0
            ? ((stats.mahiWins / (stats.totalGames - stats.draws - stats.ties)) * 100).toFixed(0)
            : 0
        }%`}
        icon={<Trophy className="h-5 w-5 text-emerald-600" />}
        highlight="emerald"
      />
      <KpiCard
        title="Ties / Draws"
        value={`${stats.ties} / ${stats.draws}`}
        icon={<Scale className="h-5 w-5 text-gray-600" />}
      />
      <KpiCard
        title="Fastest Time"
        value={`${stats.fastestTime}s`}
        subValue={stats.fastestPlayer.charAt(0).toUpperCase() + stats.fastestPlayer.slice(1)}
        icon={<Zap className="h-5 w-5 text-amber-600" />}
      />
      <KpiCard
        title="Avg. Win Margin"
        value={`${stats.avgDiff}s`}
        icon={<Timer className="h-5 w-5 text-gray-600" />}
      />
      <KpiCard
        title="Aditya Avg. Time"
        value={`${stats.adityaAvgTime}s`}
        icon={<Clock className="h-5 w-5 text-indigo-600" />}
      />
      <KpiCard
        title="Mahi Avg. Time"
        value={`${stats.mahiAvgTime}s`}
        icon={<Clock className="h-5 w-5 text-emerald-600" />}
      />
    </div>
  );
}
