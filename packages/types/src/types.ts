import { WebSocket } from "ws";

export type Shape = {
    id: string;
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
    lineCoordinates?: { startX: number, startY: number, endX: number, endY: number };
};

export interface Point { x: number, y: number }
export type Types = "pencil" | "box" | "ellipse" | "line" | "text"

export type Tools = "select"

export type CursorTypes = "cursor-default" | "cursor-crosshair" | "cursor-move" | "cursor-pointer" | `cursor-${Directions}-resize` | "cursor-grab"

export type Directions = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | "nesw" | "nwse" | "rotate"

export interface EventType {
    type: "updated" | "insertion" | "delete",
    shapeId: string,
    initialShape: Shape | undefined,
    updatedShape: Shape | undefined
}

export interface RoomType {
    roomId: string,
    shapes: Shape[],
    clients: Set<WebSocket>
}

export interface WSMessage {
   roomId: string,
   messageType: MessageType,
   payload: any
}

export type MessageType = "create-room" | "join-room" | "room-state" | "shape-operation" | "leave-room";