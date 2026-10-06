import { Point } from "./point";

export const drawGrid = (
  ctx: CanvasRenderingContext2D,
  rows: number,
  cols: number,
  size: number,
  color1: string,
  color2: string,
) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (r + c) % 2 == 0 ? color1 : color2;
      ctx.fillRect(c * size, r * size, size, size);
    }
  }
};

export const drawSnake = (
  ctx: CanvasRenderingContext2D,
  size: number,
  snake: Point[],
  color: string,
) => {
  snake.map((p) => {
    ctx.fillStyle = color;
    ctx.fillRect(p.x * size, p.y * size, size, size);
  });
};

export const drawApple = (
  ctx: CanvasRenderingContext2D,
  size: number,
  apple: Point,
  color: string,
) => {
  ctx.fillStyle = color;
  ctx.fillRect(apple.x * size, apple.y * size, size, size);
};
