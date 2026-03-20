import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearSelectorProps {
  year: number;
  onChange: (year: number) => void;
}

export function YearSelector({ year, onChange }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const minYear = 2025;

  return (
    <div className="flex w-fit items-center gap-3 border border-[#1C1C1C] bg-[#F5F4F0] px-3 py-1.5 text-[#1C1C1C]">
      <button
        onClick={() => onChange(year - 1)}
        disabled={year <= minYear}
        className="cursor-pointer transition-colors hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="font-mono text-xs font-bold tracking-widest uppercase">{year} Season</span>
      <button
        onClick={() => onChange(year + 1)}
        disabled={year >= currentYear}
        className="cursor-pointer transition-colors hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
