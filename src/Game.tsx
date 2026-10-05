import { useRef, useState, useEffect } from "react";
import { Point } from "./point";
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

function Game({ rows, cols, size }: GameProps) {
  const gridRef = useRef<HTMLCanvasElement>(null);
  const [snake] = useState(() => [getRandPoint(rows, cols)]);

  useEffect(() => {
    const ctx = gridRef.current?.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, rows, cols, size, "#14532d", "#166534");
    drawSnake(ctx, size, snake, "blue");
  }, [snake, rows, cols, size]);

  return (
    <canvas ref={gridRef} width={cols * size} height={rows * size}></canvas>
  );
}

export default Game;
