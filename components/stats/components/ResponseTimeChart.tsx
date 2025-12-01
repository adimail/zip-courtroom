"use client";

import { RawData } from "@/lib/courtroom";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface ResponseTimeChartProps {
  rawData: RawData;
}

export function ResponseTimeChart({ rawData }: ResponseTimeChartProps) {
  const trendData = rawData.map((r) => ({
    name: r.puzzleNo,
    Aditya: r.aditya,
    Mahi: r.mahi,
  }));

  return (
    <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4 md:p-6 lg:col-span-2">
      <div className="mb-6 border-b border-gray-300 pb-2">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C1C1C] md:text-xl">
          <TrendingUp className="h-5 w-5 text-amber-600" />
          RESPONSE TIME HISTORY
        </h2>
        <p className="mt-1 text-xs tracking-wide text-gray-500 uppercase">
          Raw solve times (Lower is better)
        </p>
      </div>

      <div className="h-[300px] w-full md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
            <Legend verticalAlign="top" height={36} />
            <Line
              type="linear"
              dataKey="Aditya"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3, fill: "#4f46e5" }}
              activeDot={{ r: 6 }}
              connectNulls
            />
            <Line
              type="linear"
              dataKey="Mahi"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981" }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
