import * as React from "react";

interface KpiCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  highlight?: "indigo" | "emerald";
}

export function KpiCard({ title, value, subValue, icon, highlight }: KpiCardProps) {
  const textColor =
    highlight === "indigo"
      ? "text-indigo-700"
      : highlight === "emerald"
        ? "text-emerald-700"
        : "text-[#1C1C1C]";

  return (
    <div className="flex h-full flex-col justify-between border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4">
      <div className="mb-2 flex items-center justify-between border-b border-gray-300 pb-2">
        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
          {title}
        </span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-bold md:text-3xl ${textColor}`}>{value}</span>
        {subValue && <span className="font-mono text-xs text-gray-500">{subValue}</span>}
      </div>
    </div>
  );
}
