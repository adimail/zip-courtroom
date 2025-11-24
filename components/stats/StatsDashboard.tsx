'use client';

import { MatchResult, CourtStats, RawData } from '@/lib/courtroom';
import {
  ArrowLeft,
  Trophy,
  Timer,
  TrendingUp,
  Scale,
  PieChart as PieChartIcon,
  Activity,
  Calendar as CalendarIcon,
} from 'lucide-react';
import Link from 'next/link';
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
} from 'recharts';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { parse } from 'date-fns';

interface StatsDashboardProps {
  matches: MatchResult[];
  stats: CourtStats;
  rawData: RawData;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    if ('difference' in data) {
      const isAditya = data.winner === 'aditya';
      return (
        <div className='bg-slate-900 text-white text-xs p-2 rounded shadow-lg border border-slate-700'>
          <p className='font-bold mb-1'>Puzzle #{label}</p>
          <p className={isAditya ? 'text-indigo-400' : 'text-emerald-400'}>
            Winner: {isAditya ? 'Aditya' : 'Mahi'}
          </p>
          <p>Margin: {data.difference.toFixed(2)}s</p>
        </div>
      );
    }

    return (
      <div className='bg-slate-900 text-white text-xs p-2 rounded shadow-lg border border-slate-700'>
        <p className='font-bold mb-1'>Puzzle #{label}</p>
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

export function StatsDashboard({
  matches,
  stats,
  rawData,
}: StatsDashboardProps) {
  const diffData = matches
    .filter((m) => m.winner !== 'tie' && m.diff >= 0)
    .map((m) => ({
      name: m.puzzleNo,
      difference: m.diff,
      winner: m.winner,
    }));

  const pieData = [
    { name: 'Aditya', value: stats.adityaWins, color: '#4f46e5' },
    { name: 'Mahi', value: stats.mahiWins, color: '#10b981' },
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
      const parsedDate = parse(match.date, 'd MMM yyyy', new Date());

      if (match.winner === 'aditya') {
        adityaDays.push(parsedDate);
      } else if (match.winner === 'mahi') {
        mahiDays.push(parsedDate);
      }
    } catch (error) {
      console.error('Error parsing date for calendar:', match.date);
    }
  });

  return (
    <div className='min-h-screen bg-slate-50 font-sans text-slate-900 pb-10'>
      {/* Header */}
      <header className='bg-slate-900 text-amber-50 border-b-4 border-amber-600 py-4 md:py-6 sticky top-0 z-30 shadow-md'>
        <div className='container mx-auto px-4 flex items-center gap-4'>
          <Link
            href='/'
            className='p-2 hover:bg-slate-800 rounded-full transition-colors'
          >
            <ArrowLeft className='w-5 h-5 md:w-6 md:h-6' />
          </Link>
          <div>
            <h1 className='text-xl md:text-3xl font-serif font-bold tracking-tight'>
              COURT STATISTICS
            </h1>
            <p className='text-amber-500/80 text-[10px] md:text-xs uppercase tracking-widest'>
              Performance Analytics
            </p>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-6 md:py-8 space-y-8'>
        {/* KPI Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <KpiCard
            title='Total Cases'
            value={stats.totalGames.toString()}
            icon={<Scale className='w-5 h-5 text-slate-400' />}
          />
          <KpiCard
            title='Aditya Wins'
            value={stats.adityaWins.toString()}
            subValue={`${
              stats.totalGames > 0
                ? ((stats.adityaWins / stats.totalGames) * 100).toFixed(0)
                : 0
            }%`}
            icon={<Trophy className='w-5 h-5 text-indigo-500' />}
            highlight='indigo'
          />
          <KpiCard
            title='Mahi Wins'
            value={stats.mahiWins.toString()}
            subValue={`${
              stats.totalGames > 0
                ? ((stats.mahiWins / stats.totalGames) * 100).toFixed(0)
                : 0
            }%`}
            icon={<Trophy className='w-5 h-5 text-emerald-500' />}
            highlight='emerald'
          />
          <KpiCard
            title='Avg. Margin'
            value={`${stats.avgDiff}s`}
            icon={<Timer className='w-5 h-5 text-amber-500' />}
          />
        </div>

        {/* Row: Pie Chart & Time Diff Line Chart */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Pie Chart */}
          <div className='bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1'>
            <div className='mb-4'>
              <h2 className='text-lg font-serif font-bold text-slate-800 flex items-center gap-2'>
                <PieChartIcon className='w-5 h-5 text-amber-600' />
                Win Distribution
              </h2>
            </div>
            <div className='h-[250px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend verticalAlign='bottom' height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Time Difference Line Chart */}
          <div className='bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2'>
            <div className='mb-4'>
              <h2 className='text-lg font-serif font-bold text-slate-800 flex items-center gap-2'>
                <Activity className='w-5 h-5 text-amber-600' />
                Time Difference History
              </h2>
              <p className='text-xs text-slate-500'>
                <span className='text-indigo-600 font-bold'>● Aditya</span> vs{' '}
                <span className='text-emerald-600 font-bold'>● Mahi</span>{' '}
                (Higher = Larger Margin)
              </p>
            </div>
            <div className='h-[250px] md:h-[300px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={diffData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e2e8f0'
                  />
                  <XAxis dataKey='name' tick={{ fontSize: 10 }} />
                  <YAxis
                    label={{
                      value: 'Seconds',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#64748b' },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke='#94a3b8' strokeDasharray='3 3' />
                  <Line
                    type='monotone'
                    dataKey='difference'
                    stroke='#94a3b8'
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const isAditya = payload.winner === 'aditya';
                      return (
                        <circle
                          key={payload.name}
                          cx={cx}
                          cy={cy}
                          r={6}
                          fill={isAditya ? '#4f46e5' : '#10b981'}
                          stroke='white'
                          strokeWidth={2}
                        />
                      );
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Row: Calendar & Response Time Trends */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Calendar View */}
          <div className='bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1 flex flex-col'>
            <div className='mb-4'>
              <h2 className='text-lg font-serif font-bold text-slate-800 flex items-center gap-2'>
                <CalendarIcon className='w-5 h-5 text-amber-600' />
                Victory Calendar
              </h2>
              <p className='text-xs text-slate-500'>Dates marked by winner</p>
            </div>

            <div className='flex-1 flex flex-col items-center justify-center'>
              <style>{`
                        .rdp { --rdp-cell-size: 40px; margin: 0; }
                        .rdp-day_selected:not([disabled]) { font-weight: bold; }
                    `}</style>
              <DayPicker
                modifiers={{
                  aditya: adityaDays,
                  mahi: mahiDays,
                }}
                modifiersStyles={{
                  aditya: {
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    borderRadius: '100%',
                    fontWeight: 'bold',
                  },
                  mahi: {
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '100%',
                    fontWeight: 'bold',
                  },
                }}
                showOutsideDays
                fixedWeeks
              />

              <div className='flex gap-4 mt-4 text-xs font-medium'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-indigo-600'></div>
                  <span>Aditya</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full bg-emerald-500'></div>
                  <span>Mahi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Trends */}
          <div className='bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2'>
            <div className='mb-6'>
              <h2 className='text-lg md:text-xl font-serif font-bold text-slate-800 flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-amber-600' />
                Response Time History
              </h2>
              <p className='text-sm text-slate-500 mt-1'>
                Tracking raw solve times across all puzzles. Lower is better.
              </p>
            </div>

            <div className='h-[300px] md:h-[400px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#e2e8f0'
                  />
                  <XAxis dataKey='name' tick={{ fontSize: 10 }} />
                  <YAxis
                    label={{
                      value: 'Seconds',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#64748b' },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign='top' height={36} />
                  <Line
                    type='monotone'
                    dataKey='Aditya'
                    stroke='#4f46e5'
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#4f46e5' }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                  <Line
                    type='monotone'
                    dataKey='Mahi'
                    stroke='#10b981'
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#10b981' }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <h3 className='font-serif font-bold text-slate-700 mb-4'>
              Aditya&apos;s Profile
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm border-b border-slate-100 pb-2'>
                <span className='text-slate-500'>Average Time</span>
                <span className='font-mono font-bold text-slate-800'>
                  {stats.adityaAvgTime}s
                </span>
              </div>
              <div className='flex justify-between text-sm border-b border-slate-100 pb-2'>
                <span className='text-slate-500'>Fastest Record</span>
                <span className='font-mono font-bold text-slate-800'>
                  {stats.fastestPlayer === 'aditya' ? stats.fastestTime : '-'}s
                </span>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-xl border border-slate-200 shadow-sm'>
            <h3 className='font-serif font-bold text-slate-700 mb-4'>
              Mahi&apos;s Profile
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm border-b border-slate-100 pb-2'>
                <span className='text-slate-500'>Average Time</span>
                <span className='font-mono font-bold text-slate-800'>
                  {stats.mahiAvgTime}s
                </span>
              </div>
              <div className='flex justify-between text-sm border-b border-slate-100 pb-2'>
                <span className='text-slate-500'>Fastest Record</span>
                <span className='font-mono font-bold text-slate-800'>
                  {stats.fastestPlayer === 'mahi' ? stats.fastestTime : '-'}s
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
  highlight?: 'indigo' | 'emerald';
}) {
  const textColor =
    highlight === 'indigo'
      ? 'text-indigo-600'
      : highlight === 'emerald'
      ? 'text-emerald-600'
      : 'text-slate-900';

  return (
    <div className='bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full'>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-xs text-slate-500 uppercase tracking-wider font-medium'>
          {title}
        </span>
        {icon}
      </div>
      <div className='flex items-baseline gap-2'>
        <span className={`text-2xl md:text-3xl font-bold ${textColor}`}>
          {value}
        </span>
        {subValue && (
          <span className='text-xs text-slate-400 font-mono'>{subValue}</span>
        )}
      </div>
    </div>
  );
}
