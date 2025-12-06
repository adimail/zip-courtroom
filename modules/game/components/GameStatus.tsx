import React, { useEffect, useState } from "react";
import { Timer, AlertCircle, CheckCircle2 } from "lucide-react";

interface GameStatusProps {
  status: "playing" | "won" | "incomplete";
  startTime: number | null;
  finalTime: number;
}

export function GameStatus({ status, startTime, finalTime }: GameStatusProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (status === "playing" && startTime) {
      const interval = setInterval(() => {
        setElapsed((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status, startTime]);

  if (status === "won") {
    return (
      <div className="mt-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-serif text-lg font-bold uppercase">Case Closed</span>
        </div>
        <div className="font-mono text-2xl font-bold">{finalTime.toFixed(2)}s</div>
      </div>
    );
  }

  if (status === "incomplete") {
    return (
      <div className="mt-6 flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-bold tracking-wide uppercase">Cover all cells</span>
        </div>
        <div className="font-mono text-xl text-gray-500">{elapsed.toFixed(1)}s</div>
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <Timer className="h-4 w-4" />
      <span className="font-mono text-xl font-bold">{elapsed.toFixed(1)}s</span>
    </div>
  );
}
