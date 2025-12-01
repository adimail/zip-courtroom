"use client";

import { CourtStats } from "@/lib/courtroom";
import { PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface WinDistributionChartProps {
  stats: CourtStats;
}

export function WinDistributionChart({ stats }: WinDistributionChartProps) {
  const pieData = [
    { name: "Aditya", value: stats.adityaWins, color: "#4f46e5" },
    { name: "Mahi", value: stats.mahiWins, color: "#10b981" },
    { name: "Tie", value: stats.ties, color: "#94a3b8" },
    { name: "Draw", value: stats.draws, color: "#6b7280" },
  ].filter((d) => d.value > 0);

  return (
    <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4 md:p-6 lg:col-span-1">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C1C1C]">
          <PieChartIcon className="h-5 w-5 text-amber-600" />
          WIN DISTRIBUTION
        </h2>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1C1C1C" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1C1C1C",
                border: "none",
                color: "#EBE8E1",
              }}
              itemStyle={{ color: "#EBE8E1" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
