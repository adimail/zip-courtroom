import { ArrowLeft, HelpCircle, Settings } from "lucide-react";
import Link from "next/link";

interface GameHeaderProps {
  onShowTutorial: () => void;
  onShowSettings: () => void;
}

export function GameHeader({ onShowTutorial, onShowSettings }: GameHeaderProps) {
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
      <div className="flex gap-2">
        <button
          onClick={onShowSettings}
          className="rounded-full border border-gray-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Settings className="h-4 w-4" />
        </button>
        <button
          onClick={onShowTutorial}
          className="rounded-full border border-gray-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
