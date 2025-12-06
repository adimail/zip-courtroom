import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  HelpCircle,
  Settings,
  ChevronDown,
  Check,
  Share2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Difficulty } from "../types";
import { cn } from "@/lib/utils";

interface GameHeaderProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onShowTutorial: () => void;
  onShare: () => void;
}

export function GameHeader({
  difficulty,
  onDifficultyChange,
  onShowTutorial,
  onShare,
}: GameHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShareClick = () => {
    onShare();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  return (
    <div className="mb-6 flex w-full max-w-md items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase transition-colors hover:text-amber-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Exit Case
      </Link>

      <div className="font-serif text-xl font-bold tracking-wider uppercase">ZIP</div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleShareClick}
          className={cn(
            "flex cursor-pointer items-center justify-center rounded-full border p-1 transition-all",
            isCopied
              ? "border-green-500 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              : "border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
          )}
          title="Share Puzzle"
        >
          {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-500 px-3 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Settings className="h-3 w-3" />
            <span>{difficulty}</span>
            <ChevronDown
              className={cn("h-3 w-3 cursor-pointer transition-transform", isOpen && "rotate-180")}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 z-50 mt-2 w-32 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-[#1C1C1C]">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    onDifficultyChange(d);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-[10px] font-bold uppercase transition-colors hover:bg-gray-100 dark:hover:bg-[#2A2A2A]",
                    difficulty === d
                      ? "text-amber-600 dark:text-amber-500"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {d}
                  {difficulty === d && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onShowTutorial}
          className="cursor-pointer rounded-full border border-gray-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
