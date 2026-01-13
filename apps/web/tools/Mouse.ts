import { Shape } from "../app/types/types";

export function toLocalMouse(px: number, py: number, shape: Shape, centerX?: number, centerY?: number) {
  if (!shape.rotation) return { x: px, y: py };

  let cx;
  let cy;
  if (centerX && centerY) {
    cx = centerX;
    cy = centerY;
  } else {
    cx = (shape.startX! + shape.endX!) / 2;
    cy = (shape.startY! + shape.endY!) / 2;
  }

  const dx = px - cx;
  const dy = py - cy;

  const cos = Math.cos(-shape.rotation);
  const sin = Math.sin(-shape.rotation);

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

export function toWorldPoint(px: number, py: number, shape: Shape, centerX?: number, centerY?: number) {
  if (!shape.rotation) return { x: px, y: py };

  let cx;
  let cy;
  if (centerX && centerY) {
    cx = centerX;
    cy = centerY;
  } else {
    cx = (shape.startX! + shape.endX!) / 2;
    cy = (shape.startY! + shape.endY!) / 2;
  }

  const dx = px - cx;
  const dy = py - cy;

  const cos = Math.cos(shape.rotation);
  const sin = Math.sin(shape.rotation);

  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}