import React, { useRef, useState } from "react";
import { LevelData, Point } from "../types";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

const CELL_SIZE = 55;

interface GameBoardProps {
  level: LevelData;
  path: Point[];
  onPathChange: (newPath: Point[]) => void;
  onAttemptFinish: (isSuccess: boolean) => void;
  isWon: boolean;
  isPaused: boolean;
  onStartGame: () => void;
}

export function GameBoard({
  level,
  path,
  onPathChange,
  onAttemptFinish,
  isWon,
  isPaused,
  onStartGame,
}: GameBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getPointFromEvent = (e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    if (row >= 0 && row < level.rows && col >= 0 && col < level.cols) {
      return { r: row, c: col };
    }
    return null;
  };

  const isWallBlocking = (current: Point, next: Point) => {
    if (current.r === next.r) {
      const c = Math.min(current.c, next.c);
      return level.walls.some((w) => w.type === "vertical" && w.r === current.r && w.c === c);
    }
    if (current.c === next.c) {
      const r = Math.min(current.r, next.r);
      return level.walls.some((w) => w.type === "horizontal" && w.r === r && w.c === current.c);
    }
    return false;
  };

  const isValidMove = (current: Point, next: Point) => {
    const isAdjacent = Math.abs(current.r - next.r) + Math.abs(current.c - next.c) === 1;
    if (!isAdjacent) return false;
    return !isWallBlocking(current, next);
  };

  const getCurrentSegmentNumber = () => {
    let max = 1;
    for (const p of path) {
      const val = level.checkpoints[`${p.r},${p.c}`];
      if (val && val > max) max = val;
    }
    return max;
  };

  const checkCompletion = (currentPath: Point[]) => {
    const head = currentPath[currentPath.length - 1];
    const headVal = level.checkpoints[`${head.r},${head.c}`];

    if (headVal === level.maxNumber) {
      const totalCells = level.rows * level.cols;
      const isFull = currentPath.length === totalCells;
      onAttemptFinish(isFull);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isWon || isPaused) return;
    const p = getPointFromEvent(e);
    if (!p) return;

    const head = path[path.length - 1];
    if (p.r === head.r && p.c === head.c) {
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isWon || isPaused) return;

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
    checkCompletion(newPath);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const getPathColor = (index: number, total: number) => {
    const progress = total > 1 ? index / (total - 1) : 0;
    const lightness = 45 + progress * 20;
    return `hsl(217, 90%, ${lightness}%)`;
  };

  const pathPoints = path.map((p) => ({
    x: p.c * CELL_SIZE + CELL_SIZE / 2,
    y: p.r * CELL_SIZE + CELL_SIZE / 2,
  }));

  return (
    <div
      className="relative mx-auto mt-5 touch-none rounded-xl bg-[#EBE8E1] p-1 shadow-2xl select-none dark:bg-[#1C1C1C]"
      style={{
        width: level.cols * CELL_SIZE + 8,
        height: level.rows * CELL_SIZE + 8,
      }}
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "relative overflow-hidden rounded-lg border-2 border-gray-400 bg-white transition-all duration-300 dark:border-gray-600 dark:bg-[#2A2A2A]",
          isPaused && "blur-md filter"
        )}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${level.cols}, ${CELL_SIZE}px)`,
          width: level.cols * CELL_SIZE,
          height: level.rows * CELL_SIZE,
        }}
      >
        {Array.from({ length: level.rows * level.cols }).map((_, i) => {
          const r = Math.floor(i / level.cols);
          const c = i % level.cols;
          const key = `${r},${c}`;
          const num = level.checkpoints[key];

          const pathIndex = path.findIndex((p) => p.r === r && p.c === c);
          const isPath = pathIndex !== -1;

          const bubbleStyle = isPath
            ? { backgroundColor: getPathColor(pathIndex, path.length), color: "white" }
            : undefined;

          return (
            <div
              key={key}
              className={cn(
                "relative flex items-center justify-center border-[0.5px] border-gray-200 transition-colors duration-200 dark:border-gray-700",
                isPath ? "bg-blue-100 dark:bg-blue-900/30" : "bg-transparent"
              )}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            >
              {num && (
                <div className="relative z-30 flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1C1C] text-sm font-bold text-white shadow-sm dark:bg-[#EBE8E1] dark:text-[#1C1C1C]">
                  {num}
                </div>
              )}
            </div>
          );
        })}

        {level.walls.map((wall, i) => (
          <div
            key={`wall-${i}`}
            className="absolute bg-black dark:bg-white"
            style={{
              zIndex: 20,
              ...(wall.type === "vertical"
                ? {
                    width: "4px",
                    height: `${CELL_SIZE}px`,
                    left: `${(wall.c + 1) * CELL_SIZE - 2}px`,
                    top: `${wall.r * CELL_SIZE}px`,
                  }
                : {
                    height: "4px",
                    width: `${CELL_SIZE}px`,
                    top: `${(wall.r + 1) * CELL_SIZE - 2}px`,
                    left: `${wall.c * CELL_SIZE}px`,
                  }),
            }}
          />
        ))}

        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-visible"
          style={{ zIndex: 10 }}
        >
          <defs>
            <linearGradient id="pathGradient" gradientUnits="userSpaceOnUse">
              {path.length > 1 &&
                pathPoints.map((point, i) => {
                  const progress = i / (path.length - 1);
                  const lightness = 30 + progress * 30;
                  return (
                    <stop
                      key={i}
                      offset={`${progress * 100}%`}
                      stopColor={`hsl(217, 90%, ${lightness}%)`}
                    />
                  );
                })}
            </linearGradient>
          </defs>
          {path.length > 1 && (
            <polyline
              points={pathPoints.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth={CELL_SIZE * 0.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      {isPaused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <button
            onClick={onStartGame}
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-[#1C1C1C] shadow-xl transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="h-10 w-10 fill-current" />
          </button>
        </div>
      )}
    </div>
  );
}
