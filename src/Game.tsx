import { useRef, useEffect, useReducer } from "react";
import { Point } from "./point";
import { Dir, keyToDir, oppositeDir, dirToOffset } from "./directions";
import { drawApple, drawGrid, drawSnake } from "./draw";

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

const snakeExistsAt = (p: Point, snake: Point[]) => {
  return snake.some((s) => s.x === p.x && s.y === p.y);
};

const spawnApple = (snake: Point[], rows: number, cols: number): Point => {
  while (true) {
    const p = getRandPoint(rows, cols);
    if (!snakeExistsAt(p, snake)) return p;
  }
};

interface GameState {
  snake: Point[];
  dir: Dir | null;
  apple: Point | null;
  gameOver: boolean;
}

type GameAction =
  | { type: "TICK"; rows: number; cols: number }
  | { type: "CHANGE_DIR"; dir: Dir; rows: number; cols: number }
  | { type: "RESTART"; rows: number; cols: number };

const initialState = (rows: number, cols: number): GameState => {
  return {
    snake: [getRandPoint(rows, cols)],
    dir: null,
    apple: null,
    gameOver: false,
  };
};

function reducer(state: GameState, action: GameAction): GameState {
  if (action.type === "RESTART") return initialState(action.rows, action.cols);
  if (state.gameOver) return state;

  switch (action.type) {
    case "TICK": {
      const currDir = state.dir;
      if (!currDir) return state;

      const currHead = state.snake[state.snake.length - 1];
      const offset = dirToOffset[currDir];
      const newHead = { x: currHead.x + offset.x, y: currHead.y + offset.y };

      const ate = newHead.x === state.apple?.x && newHead.y === state.apple.y;
      const body = ate ? state.snake : state.snake.slice(1);

      if (
        hitsWall(newHead, action.rows, action.cols) ||
        snakeExistsAt(newHead, body)
      ) {
        return { ...state, gameOver: true };
      }

      const snake = [...body, newHead];
      return {
        ...state,
        snake,
        apple: ate ? spawnApple(snake, action.rows, action.cols) : state.apple,
      };
    }

    case "CHANGE_DIR": {
      const currDir = state.dir;
      if (!currDir) {
        return {
          ...state,
          dir: action.dir,
          apple: spawnApple(state.snake, action.rows, action.cols),
        };
      }
      if (action.dir === oppositeDir[currDir]) return state;
      return { ...state, dir: action.dir };
    }
  }
}

function Game({ rows, cols, size }: GameProps) {
  const gridRef = useRef<HTMLCanvasElement>(null);
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(rows, cols),
  );

  useEffect(() => {
    const ctx = gridRef.current?.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, rows, cols, size, "#14532d", "#166534");
    drawSnake(ctx, size, state.snake, "blue");
    if (state.apple) drawApple(ctx, size, state.apple, "red");
  }, [state.snake, state.apple, rows, cols, size]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r") dispatch({ type: "RESTART", rows, cols });
      const nextDir = keyToDir[e.key];
      if (nextDir) dispatch({ type: "CHANGE_DIR", dir: nextDir, rows, cols });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rows, cols]);

  useEffect(() => {
    if (state.gameOver) return;
    const id = setInterval(() => dispatch({ type: "TICK", rows, cols }), 150);
    return () => clearInterval(id);
  }, [rows, cols, state.gameOver]);

  const width = cols * size;
  const height = rows * size;

  return (
    <div className="relative" style={{ width, height }}>
      <canvas ref={gridRef} width={width} height={height}></canvas>
      {state.gameOver && (
        <div className="flex absolute inset-0 bg-black/70 justify-center items-center text-white text-2xl">
          <p>Game Over...</p>
        </div>
      )}
    </div>
  );
}

export default Game;
