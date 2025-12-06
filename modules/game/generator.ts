import { Point, LevelData, Wall, Difficulty } from "./types";

function getNeighbors(p: Point, rows: number, cols: number): Point[] {
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];
  const results: Point[] = [];
  for (const d of dirs) {
    const nr = p.r + d.r;
    const nc = p.c + d.c;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      results.push({ r: nr, c: nc });
    }
  }
  return results.sort(() => Math.random() - 0.5);
}

function generateHamiltonianPath(rows: number, cols: number): Point[] | null {
  const totalCells = rows * cols;
  const start: Point = {
    r: Math.floor(Math.random() * rows),
    c: Math.floor(Math.random() * cols),
  };

  const path: Point[] = [start];
  const visited = new Set<string>();
  visited.add(`${start.r},${start.c}`);

  let steps = 0;
  const maxSteps = 500000;

  function backtrack(): boolean {
    steps++;
    if (steps > maxSteps) return false;

    if (path.length === totalCells) {
      return true;
    }

    const current = path[path.length - 1];
    const neighbors = getNeighbors(current, rows, cols);

    // Heuristic: Prioritize neighbors that have fewer available neighbors (Warnsdorff's rule-ish)
    neighbors.sort((a, b) => {
      const aFree = getNeighbors(a, rows, cols).filter((n) => !visited.has(`${n.r},${n.c}`)).length;
      const bFree = getNeighbors(b, rows, cols).filter((n) => !visited.has(`${n.r},${n.c}`)).length;
      return aFree - bFree;
    });

    for (const next of neighbors) {
      const key = `${next.r},${next.c}`;
      if (!visited.has(key)) {
        visited.add(key);
        path.push(next);
        if (backtrack()) return true;
        path.pop();
        visited.delete(key);
      }
    }
    return false;
  }

  if (backtrack()) return path;
  return null;
}

export function generateLevel(
  difficulty: Difficulty = "medium",
  rows: number = 6,
  cols: number = 6
): LevelData {
  let fullPath: Point[] | null = null;
  let attempts = 0;

  while (!fullPath && attempts < 20) {
    fullPath = generateHamiltonianPath(rows, cols);
    attempts++;
  }

  if (!fullPath) {
    // Fallback to a simpler generation if complex one fails
    return generateLevel(difficulty, 4, 4);
  }

  const totalCells = rows * cols;
  const checkpoints: Record<string, number> = {};
  const walls: Wall[] = [];

  // 1. Generate Walls based on Difficulty
  // A wall is placed between two adjacent cells if they are NOT sequential in the path.
  const potentialWalls: Wall[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const currentIdx = fullPath.findIndex((p) => p.r === r && p.c === c);

      // Check Right
      if (c < cols - 1) {
        const rightIdx = fullPath.findIndex((p) => p.r === r && p.c === c + 1);
        if (Math.abs(currentIdx - rightIdx) !== 1) {
          potentialWalls.push({ r, c, type: "vertical" });
        }
      }
      // Check Down
      if (r < rows - 1) {
        const downIdx = fullPath.findIndex((p) => p.r === r + 1 && p.c === c);
        if (Math.abs(currentIdx - downIdx) !== 1) {
          potentialWalls.push({ r, c, type: "horizontal" });
        }
      }
    }
  }

  let wallDensity = 0;
  if (difficulty === "easy") wallDensity = 0.1; // 10% of potential walls
  if (difficulty === "medium") wallDensity = 0.3; // 30%
  if (difficulty === "hard") wallDensity = 0.6; // 60%

  // Shuffle and pick walls
  potentialWalls.sort(() => Math.random() - 0.5);
  const numWalls = Math.floor(potentialWalls.length * wallDensity);
  walls.push(...potentialWalls.slice(0, numWalls));

  // 2. Generate Checkpoints based on Difficulty
  const indices = new Set<number>();
  indices.add(0);
  indices.add(totalCells - 1);

  let minGap = 3;
  let maxGap = 5;

  if (difficulty === "easy") {
    minGap = 3;
    maxGap = 5;
  } else if (difficulty === "medium") {
    minGap = 5;
    maxGap = 9;
  } else if (difficulty === "hard") {
    minGap = 8;
    maxGap = 15;
  }

  let currentIndex = 0;
  while (currentIndex < totalCells - 1) {
    const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
    const nextIndex = currentIndex + gap;
    if (nextIndex < totalCells - 1) {
      indices.add(nextIndex);
      currentIndex = nextIndex;
    } else {
      break;
    }
  }

  const sortedIndices = Array.from(indices).sort((a, b) => a - b);

  sortedIndices.forEach((pathIndex, i) => {
    const p = fullPath![pathIndex];
    checkpoints[`${p.r},${p.c}`] = i + 1;
  });

  return {
    rows,
    cols,
    checkpoints,
    maxNumber: sortedIndices.length,
    startPoint: fullPath[0],
    walls,
  };
}
