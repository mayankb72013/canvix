export type Shape = {
    type: Types
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    path?: Path2D; //For freehand pencil
    color?: string;
    lineWidth?: number;
};

export type Types = "pencil" | "box" | "ellipse" | "line" | "text"

export type Tools = "select" | "undo" | "redo"