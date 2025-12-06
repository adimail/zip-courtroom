import { motion } from "motion/react";
import { X, Play } from "lucide-react";

interface TutorialModalProps {
  onClose: () => void;
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#333] bg-[#1C1C1C] text-[#EBE8E1] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#333] p-4">
          <h2 className="font-serif text-lg font-bold">How to play Zip</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 cursor-pointer text-gray-400" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    1
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    2
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    3
                  </div>
                </div>
                <p className="text-xs text-gray-400">Connect numbers in order</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="grid h-16 w-16 grid-cols-2 gap-1 rounded bg-[#333] p-1">
                  <div className="rounded bg-blue-500"></div>
                  <div className="rounded bg-blue-500"></div>
                  <div className="rounded bg-blue-500"></div>
                  <div className="rounded bg-blue-500"></div>
                </div>
                <p className="text-xs text-gray-400">Fill every single cell</p>
              </div>
            </div>
          </div>
          <p className="mb-6 text-center text-sm text-gray-300">
            Create a single path that visits every cell in the grid. The numbered cells must be
            visited in ascending order.
          </p>
          <button
            onClick={onClose}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-500"
          >
            <Play className="h-4 w-4 fill-current" /> Play Game
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
