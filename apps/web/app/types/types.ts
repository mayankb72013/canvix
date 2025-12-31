export type Shape = {
    id: number;
    type: Types;
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    rotation?: number;
    path?: Path2D; //For freehand pencil
    color?: string;
    strokeWidth?: number;
    strokeColor?: string;
};

export type Types = "pencil" | "box" | "ellipse" | "line" | "text"

export type Tools = "select" 

export type CursorTypes = "cursor-default"|"cursor-crosshair" | "cursor-move" | "cursor-pointer" | `cursor-${directions}-resize`

export type directions = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "nesw" | "nwse"