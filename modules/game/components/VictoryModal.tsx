import { motion } from "motion/react";

interface VictoryModalProps {
  onNext: () => void;
}

export function VictoryModal({ onNext }: VictoryModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
    >
      <div className="pointer-events-auto flex flex-col items-center gap-4 rounded-xl border-2 border-amber-500 bg-[#1C1C1C] p-8 text-center shadow-2xl">
        <h2 className="font-serif text-3xl font-bold text-amber-500 uppercase">Case Closed</h2>
        <p className="text-[#EBE8E1]">Grid filled successfully.</p>
        <button
          onClick={onNext}
          className="mt-2 rounded-full bg-amber-500 px-8 py-3 font-bold text-[#1C1C1C] hover:bg-amber-400"
        >
          Next Case
        </button>
      </div>
    </motion.div>
  );
}
