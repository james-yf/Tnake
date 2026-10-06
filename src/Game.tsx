import { useRef, useEffect, useReducer } from "react";
import { Point } from "./point";
import { Dir, keyToDir, oppositeDir, dirToOffset } from "./directions";
import { drawGrid, drawSnake } from "./draw";

type GameProps = {
  rows: number;
  cols: number;
  size: number;
};

const getRandPoint = (rows: number, cols: number): Point => {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
};

const hitsWall = (head: Point, rows: number, cols: number) => {
  return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
};

interface GameState {
  snake: Point[];
  dir: Dir | null;
}

type GameAction =
  | { type: "TICK"; rows: number; cols: number }
  | { type: "CHANGE_DIR"; dir: Dir };

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "TICK": {
      const currDir = state.dir;
      if (!currDir) return state;

      const currHead = state.snake[state.snake.length - 1];
      const offset = dirToOffset[currDir];
      const newHead = { x: currHead.x + offset.x, y: currHead.y + offset.y };

      if (hitsWall(newHead, action.rows, action.cols)) return state;

      return { ...state, snake: [...state.snake.slice(1), newHead] };
    }

    case "CHANGE_DIR": {
      const currDir = state.dir;
      if (!currDir)
        return {
          ...state,
          dir: action.dir,
        };
      if (action.dir === oppositeDir[currDir]) return state;
      return { ...state, dir: action.dir };
    }
  }
}

function Game({ rows, cols, size }: GameProps) {
  const gridRef = useRef<HTMLCanvasElement>(null);
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    snake: [getRandPoint(rows, cols)],
    dir: null,
  }));

  useEffect(() => {
    const ctx = gridRef.current?.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, rows, cols, size, "#14532d", "#166534");
    drawSnake(ctx, size, state.snake, "blue");
  }, [state.snake, rows, cols, size]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const nextDir = keyToDir[e.key];
      if (nextDir) dispatch({ type: "CHANGE_DIR", dir: nextDir });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: "TICK", rows, cols }), 150);
    return () => clearInterval(id);
  }, [rows, cols]);

  return (
    <canvas ref={gridRef} width={cols * size} height={rows * size}></canvas>
  );
}

export default Game;
