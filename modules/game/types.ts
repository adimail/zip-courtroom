export interface Point {
  r: number;
  c: number;
}

export interface LevelData {
  rows: number;
  cols: number;
  checkpoints: Record<string, number>;
  maxNumber: number;
  startPoint: Point;
}

export interface GameState {
  path: Point[];
  visited: Set<string>;
  nextNumber: number;
  isComplete: boolean;
}
