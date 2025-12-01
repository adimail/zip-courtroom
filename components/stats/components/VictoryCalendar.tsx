"use client";

import { MatchResult } from "@/lib/courtroom";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { DayPicker, DayContentProps, DayModifiers } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { parse, format } from "date-fns";

interface VictoryCalendarProps {
  matches: MatchResult[];
  onDayHover: (match: MatchResult | null, position: { x: number; y: number }) => void;
}

export function VictoryCalendar({ matches, onDayHover }: VictoryCalendarProps) {
  const router = useRouter();

  const adityaDays: Date[] = [];
  const mahiDays: Date[] = [];
  const tieDays: Date[] = [];
  const drawDays: Date[] = [];
  const dateToMatchMap = new Map<string, MatchResult>();

  matches.forEach((match) => {
    try {
      const parsedDate = parse(match.date, "d MMM yyyy", new Date());
      const dateKey = format(parsedDate, "yyyy-MM-dd");
      dateToMatchMap.set(dateKey, match);

      if (match.winner === "aditya") adityaDays.push(parsedDate);
      else if (match.winner === "mahi") mahiDays.push(parsedDate);
      else if (match.winner === "tie") tieDays.push(parsedDate);
      else if (match.winner === "draw") drawDays.push(parsedDate);
    } catch (error) {
      console.error("Error parsing date for calendar:", match.date);
    }
  });

  function CustomDayContent(props: DayContentProps) {
    return (
      <div className="flex size-full items-center justify-center text-center">
        {props.date.getDate()}
      </div>
    );
  }

  const handleDayClick = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const match = dateToMatchMap.get(dateKey);
    if (match) {
      router.push(`/case/${match.puzzleNo}`);
    }
  };

  const handleDayMouseEnter = (day: Date, _: DayModifiers, e: MouseEvent) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const match = dateToMatchMap.get(dateKey);
    if (match) {
      onDayHover(match, { x: e.clientX, y: e.clientY });
    }
  };

  const handleDayMouseLeave = () => {
    onDayHover(null, { x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col border-2 border-[#1C1C1C] bg-[#F5F4F0] p-4 md:p-6 lg:col-span-1">
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[#1C1C1C]">
          <CalendarIcon className="h-5 w-5 text-amber-600" />
          VICTORY CALENDAR
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <style>{`
            .rdp { --rdp-cell-size: 55px; margin: 0; }
            .rdp-day_selected:not([disabled]) { font-weight: bold; border-radius: 0 !important; }
            .rdp-day { border-radius: 0 !important; }
            .rdp-button { padding: 0 !important; border-radius: 0 !important; }
            .day-with-match { cursor: pointer; }
        `}</style>
        <DayPicker
          onDayClick={handleDayClick}
          onDayMouseEnter={handleDayMouseEnter}
          onDayMouseLeave={handleDayMouseLeave}
          modifiers={{
            aditya: adityaDays,
            mahi: mahiDays,
            tie: tieDays,
            draw: drawDays,
            hasMatch: (date) => dateToMatchMap.has(format(date, "yyyy-MM-dd")),
          }}
          modifiersClassNames={{
            hasMatch: "day-with-match",
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
            tie: {
              backgroundColor: "#94a3b8",
              color: "white",
              fontWeight: "bold",
              border: "1px solid #1C1C1C",
            },
            draw: {
              backgroundColor: "#6b7280",
              color: "white",
              fontWeight: "bold",
              border: "1px solid #1C1C1C",
            },
          }}
          showOutsideDays
          fixedWeeks
          components={{
            DayContent: CustomDayContent,
          }}
        />

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs font-medium tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 border border-[#1C1C1C] bg-indigo-600"></div>
            <span>Aditya</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 border border-[#1C1C1C] bg-emerald-500"></div>
            <span>Mahi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 border border-[#1C1C1C] bg-slate-400"></div>
            <span>Tie</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 border border-[#1C1C1C] bg-gray-600"></div>
            <span>Draw</span>
          </div>
        </div>
      </div>
    </div>
  );
}
