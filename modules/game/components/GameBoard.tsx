import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { LevelData, Point } from "../types";
import { cn } from "@/lib/utils";

const CELL_SIZE = 60;
const GAP = 8;

interface GameBoardProps {
  level: LevelData;
  path: Point[];
  onPathChange: (newPath: Point[]) => void;
  onWin: () => void;
  isWon: boolean;
}

export function GameBoard({ level, path, onPathChange, onWin, isWon }: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getPointFromEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / (CELL_SIZE + GAP));
    const row = Math.floor(y / (CELL_SIZE + GAP));

    if (row >= 0 && row < level.rows && col >= 0 && col < level.cols) {
      return { r: row, c: col };
    }
    return null;
  };

  const isValidMove = (current: Point, next: Point) => {
    return Math.abs(current.r - next.r) + Math.abs(current.c - next.c) === 1;
  };

  const getCurrentSegmentNumber = () => {
    let max = 1;
    for (const p of path) {
      const val = level.checkpoints[`${p.r},${p.c}`];
      if (val && val > max) max = val;
    }
    return max;
  };

  const checkWinCondition = (currentPath: Point[]) => {
    const totalCells = level.rows * level.cols;
    const head = currentPath[currentPath.length - 1];
    const headVal = level.checkpoints[`${head.r},${head.c}`];

    if (currentPath.length === totalCells && headVal === level.maxNumber) {
      onWin();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isWon) return;
    const p = getPointFromEvent(e);
    if (!p) return;

    const head = path[path.length - 1];
    if (p.r === head.r && p.c === head.c) {
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isWon) return;

    const p = getPointFromEvent(e);
    if (!p) return;

    const head = path[path.length - 1];
    const key = `${p.r},${p.c}`;

    if (p.r === head.r && p.c === head.c) return;

    const existingIndex = path.findIndex((pt) => pt.r === p.r && pt.c === p.c);

    if (existingIndex !== -1) {
      if (existingIndex === path.length - 2) {
        const newPath = path.slice(0, -1);
        onPathChange(newPath);
      }
      return;
    }

    if (!isValidMove(head, p)) return;

    const nextNum = level.checkpoints[key];
    const currentNumVal = getCurrentSegmentNumber();

    if (nextNum !== undefined) {
      if (nextNum !== currentNumVal + 1) return;
    }

    const newPath = [...path, p];
    onPathChange(newPath);
    checkWinCondition(newPath);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="relative mx-auto touch-none rounded-xl bg-[#1C1C1C] p-4 shadow-2xl select-none dark:bg-[#000000]"
      style={{
        width: level.cols * (CELL_SIZE + GAP) + GAP * 2 + 32,
        height: level.rows * (CELL_SIZE + GAP) + GAP * 2 + 32,
      }}
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${level.cols}, ${CELL_SIZE}px)`,
          gap: GAP,
        }}
      >
        {Array.from({ length: level.rows * level.cols }).map((_, i) => {
          const r = Math.floor(i / level.cols);
          const c = i % level.cols;
          const key = `${r},${c}`;
          const num = level.checkpoints[key];
          const isPath = path.some((p) => p.r === r && p.c === c);

          return (
            <div
              key={key}
              className={cn(
                "flex items-center justify-center rounded-lg text-2xl font-bold transition-colors duration-200",
                isPath ? "bg-blue-500/20" : "bg-[#2A2A2A]",
                num ? "z-10" : "z-0"
              )}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            >
              {num && (
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full shadow-sm",
                    isPath ? "bg-blue-500 text-white" : "bg-[#EBE8E1] text-[#1C1C1C]"
                  )}
                >
                  {num}
                </div>
              )}
            </div>
          );
        })}

        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-visible"
          style={{ zIndex: 5 }}
        >
          <motion.path
            d={path
              .map((p, i) => {
                const x = p.c * (CELL_SIZE + GAP) + CELL_SIZE / 2;
                const y = p.r * (CELL_SIZE + GAP) + CELL_SIZE / 2;
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={CELL_SIZE * 0.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: 1 }}
          />
        </svg>
      </div>
    </div>
  );
}
