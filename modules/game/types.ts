export type Difficulty = "easy" | "medium" | "hard";

export interface Point {
  r: number;
  c: number;
}

export interface Wall {
  r: number;
  c: number;
  type: "vertical" | "horizontal";
}

export interface LevelData {
  rows: number;
  cols: number;
  checkpoints: Record<string, number>;
  maxNumber: number;
  startPoint: Point;
  walls: Wall[];
}

export interface GameState {
  path: Point[];
  visited: Set<string>;
  nextNumber: number;
  isComplete: boolean;
}
