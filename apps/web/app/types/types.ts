export type Shape = {
    id: number;
    type: Types;
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    rotation?: number;
    path?: Path2D; //For freehand pencil
    pointsInPath?: Point[]
    color?: string;
    strokeWidth?: number;
    strokeColor?: string;
};

export interface Point {x: number, y: number}
export type Types = "pencil" | "box" | "ellipse" | "line" | "text"

export type Tools = "select" 

export type CursorTypes = "cursor-default"|"cursor-crosshair" | "cursor-move" | "cursor-pointer" | `cursor-${directions}-resize` | "cursor-grab"

export type directions = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "nesw" | "nwse" | "rotate"