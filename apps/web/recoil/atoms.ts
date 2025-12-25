import { atom } from "recoil";
import { CursorTypes, Shape, Tools, Types } from "../app/types/types";
import { devNull } from "node:os";

export const toolSelected = atom<Types | Tools>({
    key: "toolSelected",
    default: "select"
})

export const shapeId = atom<number>({
    key: "shapeId",
    default: 0
})

export const shapeSelected = atom<Shape>({
    key: "shapeSelected",
    default: undefined
})
export const clearCanvas = atom({
    key: "clearCanvas",
    default: false
})


export const shapesArray = atom<Shape[]>({
    key: "shapesArray",
    default: []
})

export const shapesChange = atom<boolean>({
    key: "shapesChange",
    default: false
})

export const cursorState = atom<CursorTypes>({
    key: "cursorState",
    default: "cursor-default"
})

export const strokeColor = atom({
    key: "strokeColor",
    default: '#000000'
})

export const strokeWidth = atom({
    key: "strokeWidth",
    default: 4
})