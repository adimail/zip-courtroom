import { RotateCcw, X, Lightbulb } from "lucide-react";

interface GameControlsProps {
  onUndo: () => void;
  onReset: () => void;
  onNewGame: () => void;
  canUndo: boolean;
  canReset: boolean;
}

export function GameControls({ onUndo, onReset, onNewGame, canUndo, canReset }: GameControlsProps) {
  return (
    <div className="mt-8 flex justify-center gap-4">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="flex w-24 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#1C1C1C] bg-[#F5F4F0] py-3 text-xs font-bold tracking-widest uppercase shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-[#2A2A2A] dark:text-white"
      >
        <RotateCcw className="h-3 w-3" /> Undo
      </button>
      <button
        onClick={onReset}
        disabled={!canReset}
        className="flex w-24 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#1C1C1C] bg-[#F5F4F0] py-3 text-xs font-bold tracking-widest uppercase shadow-sm transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-[#2A2A2A] dark:text-white"
      >
        <X className="h-3 w-3" /> Reset
      </button>
      <button
        onClick={onNewGame}
        className="flex w-24 cursor-pointer items-center justify-center gap-2 rounded-full border border-amber-600 bg-amber-500 py-3 text-xs font-bold tracking-widest text-[#1C1C1C] uppercase shadow-sm transition-transform active:scale-95"
      >
        <Lightbulb className="h-3 w-3" /> New
      </button>
    </div>
  );
}
