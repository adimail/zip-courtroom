"use client";

import { MatchResult, CourtStats, RawData } from "@/lib/courtroom";
import {
  ArrowLeft,
  Trophy,
  Timer,
  TrendingUp,
  Scale,
  PieChart as PieChartIcon,
  Activity,
  Calendar as CalendarIcon,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { parse } from "date-fns";

interface StatsDashboardProps {
  matches: MatchResult[];
  stats: CourtStats;
  rawData: RawData;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
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

export function StatsDashboard({ matches, stats, rawData }: StatsDashboardProps) {
  const diffData = matches
    .filter((m) => m.winner !== "tie" && m.diff >= 0)
    .map((m) => ({
      name: m.puzzleNo,
      difference: m.diff,
      winner: m.winner,
    }));

  const pieData = [
    { name: "Aditya", value: stats.adityaWins, color: "#4f46e5" },
    { name: "Mahi", value: stats.mahiWins, color: "#10b981" },
  ].filter((d) => d.value > 0);

  const trendData = rawData.map((r) => ({
    name: r.puzzleNo,
    Aditya: r.aditya,
    Mahi: r.mahi,
  }));

  const adityaDays: Date[] = [];
  const mahiDays: Date[] = [];

  matches.forEach((match) => {
    try {
      const parsedDate = parse(match.date, "d MMM yyyy", new Date());

      if (match.winner === "aditya") {
        adityaDays.push(parsedDate);
      } else if (match.winner === "mahi") {
        mahiDays.push(parsedDate);
      }
    } catch (error) {
      console.error("Error parsing date for calendar:", match.date);
    }
  });

  return (
    <div className="min-h-screen bg-[#EBE8E1] pb-10 font-sans text-[#1C1C1C]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b-4 border-[#1C1C1C] bg-[#1C1C1C] py-4 text-[#EBE8E1] shadow-none md:py-6">
        <div className="container mx-auto flex items-center gap-4 px-4">
          <Link
            href="/"
            className="border border-gray-600 p-2 transition-colors hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider uppercase md:text-3xl">
              COURT STATISTICS
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-amber-500 uppercase md:text-xs">
              Performance Analytics
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-6 md:py-8">
        {/* KPI Cards */}
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
              stats.totalGames > 0 ? ((stats.adityaWins / stats.totalGames) * 100).toFixed(0) : 0
            }%`}
            icon={<Trophy className="h-5 w-5 text-indigo-600" />}
            highlight="indigo"
          />
          <KpiCard
            title="Mahi Wins"
            value={stats.mahiWins.toString()}
            subValue={`${
              stats.totalGames > 0 ? ((stats.mahiWins / stats.totalGames) * 100).toFixed(0) : 0
            }%`}
            icon={<Trophy className="h-5 w-5 text-emerald-600" />}
            highlight="emerald"
          />
          <KpiCard
            title="Avg. Margin"
            value={`${stats.avgDiff}s`}
            icon={<Timer className="h-5 w-5 text-amber-600" />}
          />
        </div>

        {/* Row: Pie Chart & Time Diff Line Chart */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Pie Chart */}
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
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#1C1C1C"
                        strokeWidth={2}
                      />
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

          {/* Time Difference Line Chart */}
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
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#1C1C1C" strokeWidth={2} />
                  <Line
                    type="linear" // Sharp lines
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
        </div>

        {/* Row: Calendar & Response Time Trends */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar View */}
          <div className="flex flex-col border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4 md:p-6 lg:col-span-1">
            <div className="mb-4 border-b border-gray-300 pb-2">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C1C1C]">
                <CalendarIcon className="h-5 w-5 text-amber-600" />
                VICTORY CALENDAR
              </h2>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center">
              <style>{`
                        .rdp { --rdp-cell-size: 40px; margin: 0; }
                        .rdp-day_selected:not([disabled]) { font-weight: bold; border-radius: 0 !important; }
                        .rdp-day { border-radius: 0 !important; }
                    `}</style>
              <DayPicker
                modifiers={{
                  aditya: adityaDays,
                  mahi: mahiDays,
                }}
                modifiersStyles={{
                  aditya: {
                    backgroundColor: "#4f46e5",
                    color: "white",
                    fontWeight: "bold",
                    border: "1px solid #1C1C1C",
                  },
                  mahi: {
                    backgroundColor: "#10b981",
                    color: "white",
                    fontWeight: "bold",
                    border: "1px solid #1C1C1C",
                  },
                }}
                showOutsideDays
                fixedWeeks
              />

              <div className="mt-4 flex gap-4 text-xs font-medium tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border border-[#1C1C1C] bg-indigo-600"></div>
                  <span>Aditya</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border border-[#1C1C1C] bg-emerald-500"></div>
                  <span>Mahi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Trends */}
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="linear"
                    dataKey="Aditya"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#4f46e5", shape: "square" }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                  <Line
                    type="linear"
                    dataKey="Mahi"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#10b981", shape: "square" }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-6">
            <h3 className="mb-4 w-fit border-b-2 border-indigo-600 font-serif text-lg font-bold text-[#1C1C1C] uppercase">
              Aditya&apos;s Profile
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
                <span className="text-xs tracking-wider text-gray-600 uppercase">Average Time</span>
                <span className="font-mono font-bold text-[#1C1C1C]">{stats.adityaAvgTime}s</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
                <span className="text-xs tracking-wider text-gray-600 uppercase">
                  Fastest Record
                </span>
                <span className="font-mono font-bold text-[#1C1C1C]">
                  {stats.fastestPlayer === "aditya" ? stats.fastestTime : "-"}s
                </span>
              </div>
            </div>
          </div>

          <div className="border-2 border-[#1C1C1C] bg-[#F5F4F0] p-6">
            <h3 className="mb-4 w-fit border-b-2 border-emerald-600 font-serif text-lg font-bold text-[#1C1C1C] uppercase">
              Mahi&apos;s Profile
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
                <span className="text-xs tracking-wider text-gray-600 uppercase">Average Time</span>
                <span className="font-mono font-bold text-[#1C1C1C]">{stats.mahiAvgTime}s</span>
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-2 text-sm">
                <span className="text-xs tracking-wider text-gray-600 uppercase">
                  Fastest Record
                </span>
                <span className="font-mono font-bold text-[#1C1C1C]">
                  {stats.fastestPlayer === "mahi" ? stats.fastestTime : "-"}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function KpiCard({
  title,
  value,
  subValue,
  icon,
  highlight,
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  highlight?: "indigo" | "emerald";
}) {
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
