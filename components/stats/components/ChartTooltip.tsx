"use client";

import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const ChartTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    if ("difference" in data) {
      const isAditya = data.winner === "aditya";
      return (
        <div className="border-2 border-[#1C1C1C] bg-[#1C1C1C] p-3 text-xs text-[#EBE8E1] shadow-none">
          <p className="mb-1 font-serif font-bold tracking-wider uppercase">Puzzle #{label}</p>
          <p className={isAditya ? "text-indigo-400" : "text-emerald-400"}>
            Winner: {isAditya ? "Aditya" : "Mahi"}
          </p>
          <p>Margin: {data.difference.toFixed(2)}s</p>
        </div>
      );
    }

    return (
      <div className="border-2 border-[#1C1C1C] bg-[#1C1C1C] p-3 text-xs text-[#EBE8E1] shadow-none">
        <p className="mb-1 font-serif font-bold tracking-wider uppercase">Puzzle #{label}</p>
        {payload.map((p, idx) => (
          <p key={idx} style={{ color: p.color }}>
            {p.name}: {p.value}s
          </p>
        ))}
      </div>
    );
  }
  return null;
};
