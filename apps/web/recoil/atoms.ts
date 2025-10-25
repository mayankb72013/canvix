import { atom } from "recoil";
import { Shape, Tools, Types } from "../app/types/types";

export const toolSelected = atom<Types | Tools>({
    key: "toolSelected",
    default: "pencil"
})

export const clearCanvas = atom({
    key: "clearCanvas",
    default: false
})

export const undoStack = atom<Shape[]>({
    key: "undoStack",
    default: []
})

export const redoStack = atom<Shape[]>({
    key: "redoStack",
    default: []
})