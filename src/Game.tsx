import { useRef, useEffect } from "react";
import { drawGrid } from "./draw";

type GameProps = {
  rows: number;
  cols: number;
  size: number;
};

function Game({ rows, cols, size }: GameProps) {
  const gridRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gridRef.current?.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, rows, cols, size, "green", "yellow");
  }, []);

  return (
    <canvas ref={gridRef} width={cols * size} height={rows * size}></canvas>
  );
}

export default Game;
