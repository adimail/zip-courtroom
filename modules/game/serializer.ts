import { LevelData, Wall, Point } from "./types";

type SerializedLevel = [number, number, number[], number[], number, number];

export function serializeLevel(level: LevelData): string {
  try {
    const wallData: number[] = [];
    level.walls.forEach((w) => {
      wallData.push(w.r, w.c, w.type === "vertical" ? 1 : 0);
    });

    const checkpointData: number[] = [];
    Object.entries(level.checkpoints).forEach(([key, num]) => {
      const [r, c] = key.split(",").map(Number);
      checkpointData.push(r, c, num);
    });

    const data: SerializedLevel = [
      level.rows,
      level.cols,
      wallData,
      checkpointData,
      level.startPoint.r,
      level.startPoint.c,
    ];

    const jsonString = JSON.stringify(data);

    const base64 = btoa(jsonString);

    const urlSafe = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    return urlSafe;
  } catch (error) {
    console.error("Failed to serialize level:", error);
    return "";
  }
}

export function deserializeLevel(encoded: string): LevelData | null {
  try {
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

    while (base64.length % 4) {
      base64 += "=";
    }

    const jsonString = atob(base64);
    const data: SerializedLevel = JSON.parse(jsonString);

    if (!Array.isArray(data) || data.length !== 6) {
      throw new Error("Invalid data structure");
    }

    const [rows, cols, wallData, checkpointData, startR, startC] = data;

    if (
      typeof rows !== "number" ||
      typeof cols !== "number" ||
      !Array.isArray(wallData) ||
      !Array.isArray(checkpointData) ||
      typeof startR !== "number" ||
      typeof startC !== "number"
    ) {
      throw new Error("Invalid data types");
    }

    const walls: Wall[] = [];
    for (let i = 0; i < wallData.length; i += 3) {
      walls.push({
        r: wallData[i],
        c: wallData[i + 1],
        type: wallData[i + 2] === 1 ? "vertical" : "horizontal",
      });
    }

    const checkpoints: Record<string, number> = {};
    let maxNumber = 0;
    for (let i = 0; i < checkpointData.length; i += 3) {
      const r = checkpointData[i];
      const c = checkpointData[i + 1];
      const num = checkpointData[i + 2];
      checkpoints[`${r},${c}`] = num;
      if (num > maxNumber) maxNumber = num;
    }

    const startPoint: Point = { r: startR, c: startC };

    return {
      rows,
      cols,
      walls,
      checkpoints,
      maxNumber,
      startPoint,
    };
  } catch (error) {
    console.error("Failed to deserialize level:", error);
    return null;
  }
}
