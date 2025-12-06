"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { generateLevel } from "./generator";
import { LevelData, Point, Difficulty } from "./types";
import { GameHeader } from "./components/GameHeader";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { TutorialModal } from "./components/TutorialModal";
import { VictoryModal } from "./components/VictoryModal";
import { GameSettings } from "./components/GameSettings";

export function ZipGame() {
  const [level, setLevel] = useState<LevelData | null>(null);
  const [path, setPath] = useState<Point[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback(() => {
    const newLevel = generateLevel(difficulty, 6, 6);
    setLevel(newLevel);
    setPath([newLevel.startPoint]);
    setIsWon(false);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleUndo = () => {
    if (path.length > 1 && !isWon) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  const handleReset = () => {
    if (level) {
      setPath([level.startPoint]);
      setIsWon(false);
    }
  };

  if (!level) return null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#EBE8E1] p-4 pt-8 font-sans text-[#1C1C1C] md:pt-12 dark:bg-[#1C1C1C] dark:text-[#EBE8E1]">
      <GameHeader
        onShowTutorial={() => setShowTutorial(true)}
        onShowSettings={() => setShowSettings(true)}
      />

      <GameBoard
        level={level}
        path={path}
        onPathChange={setPath}
        onWin={() => setIsWon(true)}
        isWon={isWon}
      />

      <GameControls
        onUndo={handleUndo}
        onReset={handleReset}
        onNewGame={initGame}
        canUndo={path.length > 1 && !isWon}
      />

      <AnimatePresence>
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <GameSettings
            currentDifficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{isWon && <VictoryModal onNext={initGame} />}</AnimatePresence>
    </div>
  );
}
