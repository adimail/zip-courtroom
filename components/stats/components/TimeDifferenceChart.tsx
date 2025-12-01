"use client";

import { MatchResult } from "@/lib/courtroom";
import { Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Line,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface TimeDifferenceChartProps {
  matches: MatchResult[];
}

export function TimeDifferenceChart({ matches }: TimeDifferenceChartProps) {
  const diffData = matches
    .filter((m) => m.winner !== "tie" && m.winner !== "draw" && m.diff >= 0)
    .map((m) => ({
      name: m.puzzleNo,
      difference: m.diff,
      winner: m.winner,
    }));

  return (
    <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4 md:p-6 lg:col-span-2">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C1C1C]">
          <Activity className="h-5 w-5 text-amber-600" />
          TIME DIFFERENCE HISTORY
        </h2>
        <p className="text-xs tracking-wide text-gray-500 uppercase">
          <span className="font-bold text-indigo-600">● Aditya</span> vs{" "}
          <span className="font-bold text-emerald-600">● Mahi</span> (Higher = Larger Margin)
        </p>
      </div>
      <div className="h-[250px] w-full md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={diffData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#d1d5db" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#1C1C1C" }}
              axisLine={{ stroke: "#1C1C1C" }}
              tickLine={{ stroke: "#1C1C1C" }}
            />
            <YAxis
              axisLine={{ stroke: "#1C1C1C" }}
              tickLine={{ stroke: "#1C1C1C" }}
              tick={{ fill: "#1C1C1C" }}
              label={{
                value: "Seconds",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#1C1C1C" },
              }}
            />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine y={0} stroke="#1C1C1C" strokeWidth={2} />
            <Line
              type="linear"
              dataKey="difference"
              stroke="#64748b"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const isAditya = payload.winner === "aditya";
                return (
                  <rect
                    key={payload.name}
                    x={cx - 3}
                    y={cy - 3}
                    width={6}
                    height={6}
                    fill={isAditya ? "#4f46e5" : "#10b981"}
                    stroke="#1C1C1C"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={{ r: 6, stroke: "#1C1C1C", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
