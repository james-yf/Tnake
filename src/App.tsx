import { useEffect, useRef } from "react";
import { drawGrid } from "./draw";

const ROWS = 10;
const COLS = 10;
const SIZE = 40;

function App() {
  const gridRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = gridRef.current?.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx, ROWS, COLS, SIZE, "green", "yellow");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-amber-200">
      <canvas ref={gridRef} width={COLS * SIZE} height={ROWS * SIZE}></canvas>
    </div>
  );
}

export default App;
