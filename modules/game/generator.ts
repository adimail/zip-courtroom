import { Point, LevelData } from "./types";

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

  function backtrack(): boolean {
    if (path.length === totalCells) {
      return true;
    }

    const current = path[path.length - 1];
    const neighbors = getNeighbors(current, rows, cols);

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

export function generateLevel(rows: number = 6, cols: number = 5): LevelData {
  let fullPath: Point[] | null = null;

  while (!fullPath) {
    fullPath = generateHamiltonianPath(rows, cols);
  }

  const checkpoints: Record<string, number> = {};
  const totalCells = rows * cols;

  const numCheckpoints = Math.floor(totalCells / 4) + 2;

  const indices = new Set<number>();
  indices.add(0);
  indices.add(totalCells - 1);

  while (indices.size < numCheckpoints) {
    indices.add(Math.floor(Math.random() * totalCells));
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
  };
}
