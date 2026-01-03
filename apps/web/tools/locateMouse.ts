import { Shape } from "../app/types/types";

export function toLocalMouse(px: number, py: number, shape: Shape) {
    if (!shape.rotation) return { x: px, y: py };
  
    const cx = (shape.startX! + shape.endX!) / 2;
    const cy = (shape.startY! + shape.endY!) / 2;
  
    const dx = px - cx;
    const dy = py - cy;
  
    const cos = Math.cos(-shape.rotation);
    const sin = Math.sin(-shape.rotation);
  
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    };
  }
  