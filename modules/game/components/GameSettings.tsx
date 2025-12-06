import { motion } from "motion/react";
import { X } from "lucide-react";
import { Difficulty } from "../types";

interface GameSettingsProps {
  currentDifficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onClose: () => void;
}

export function GameSettings({
  currentDifficulty,
  onDifficultyChange,
  onClose,
}: GameSettingsProps) {
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xs overflow-hidden rounded-xl border border-[#333] bg-[#1C1C1C] text-[#EBE8E1] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#333] p-4">
          <h2 className="font-serif text-lg font-bold uppercase">Difficulty</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => {
                onDifficultyChange(diff);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold uppercase transition-colors ${
                currentDifficulty === diff
                  ? "border-amber-600 bg-amber-600 text-[#1C1C1C]"
                  : "border-gray-700 bg-[#2A2A2A] text-gray-400 hover:border-gray-500"
              }`}
            >
              {diff}
              {currentDifficulty === diff && <div className="h-2 w-2 rounded-full bg-[#1C1C1C]" />}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
