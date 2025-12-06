"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { generateLevel } from "./generator";
import { LevelData, Point, Difficulty } from "./types";
import { GameHeader } from "./components/GameHeader";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { GameStatus } from "./components/GameStatus";
import { TutorialModal } from "./components/TutorialModal";
import { VictoryModal } from "./components/VictoryModal";

export function ZipGame() {
  const [level, setLevel] = useState<LevelData | null>(null);
  const [path, setPath] = useState<Point[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [showTutorial, setShowTutorial] = useState(true);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "incomplete">("playing");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finalTime, setFinalTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(true);

  const initGame = useCallback(() => {
    const newLevel = generateLevel(difficulty, 6, 6);
    setLevel(newLevel);
    setPath([newLevel.startPoint]);
    setGameStatus("playing");
    setFinalTime(0);
    setStartTime(null);
    setIsPaused(true);
  }, [difficulty]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleStartGame = () => {
    setIsPaused(false);
    setStartTime(Date.now());
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  const handlePathChange = (newPath: Point[]) => {
    setPath(newPath);
    if (gameStatus === "incomplete") {
      setGameStatus("playing");
    }
  };

  const handleAttemptFinish = (isSuccess: boolean) => {
    if (isSuccess) {
      setGameStatus("won");
      if (startTime) {
        setFinalTime((Date.now() - startTime) / 1000);
      }
    } else {
      setGameStatus("incomplete");
    }
  };

  const handleUndo = () => {
    if (path.length > 1 && gameStatus !== "won" && !isPaused) {
      setPath((prev) => prev.slice(0, -1));
      setGameStatus("playing");
    }
  };

  const handleReset = () => {
    if (level && !isPaused) {
      setPath([level.startPoint]);
      setGameStatus("playing");
    }
  };

  if (!level) return null;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#EBE8E1] p-4 pt-8 font-sans text-[#1C1C1C] md:pt-12 dark:bg-[#1C1C1C] dark:text-[#EBE8E1]">
      <GameHeader
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onShowTutorial={() => setShowTutorial(true)}
      />

      <GameBoard
        level={level}
        path={path}
        onPathChange={handlePathChange}
        onAttemptFinish={handleAttemptFinish}
        isWon={gameStatus === "won"}
        isPaused={isPaused}
        onStartGame={handleStartGame}
      />

      <GameStatus status={gameStatus} startTime={startTime} finalTime={finalTime} />

      <GameControls
        onUndo={handleUndo}
        onReset={handleReset}
        onNewGame={initGame}
        canUndo={path.length > 1 && gameStatus !== "won" && !isPaused}
      />

      <AnimatePresence>
        {showTutorial && <TutorialModal onClose={handleTutorialClose} />}
      </AnimatePresence>

      <AnimatePresence>
        {gameStatus === "won" && <VictoryModal onNext={initGame} />}
      </AnimatePresence>
    </div>
  );
}
