import { CourtStats } from "@/lib/courtroom";

interface PlayerProfileProps {
  stats: CourtStats;
  player: "aditya" | "mahi";
}

export function PlayerProfile({ stats, player }: PlayerProfileProps) {
  const isAditya = player === "aditya";
  const profile = {
    name: isAditya ? "Aditya" : "Mahi",
    borderColor: isAditya ? "border-indigo-600" : "border-emerald-600",
    avgTime: isAditya ? stats.adityaAvgTime : stats.mahiAvgTime,
    fastestTime: stats.fastestPlayer === player ? stats.fastestTime : "-",
  };

  return (
    <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-6">
      <h3
        className={`mb-4 w-fit border-b-2 ${profile.borderColor} font-serif text-lg font-bold text-[#1C1C1C] uppercase`}
      >
        {profile.name}&apos;s Profile
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
          <span className="text-xs tracking-wider text-gray-600 uppercase">Average Time</span>
          <span className="font-mono font-bold text-[#1C1C1C]">{profile.avgTime}s</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
          <span className="text-xs tracking-wider text-gray-600 uppercase">Fastest Record</span>
          <span className="font-mono font-bold text-[#1C1C1C]">
            {profile.fastestTime}
            {profile.fastestTime !== "-" && "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
