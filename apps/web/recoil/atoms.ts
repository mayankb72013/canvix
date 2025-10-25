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


export const shapesArray = atom<Shape[]>({
    key: "shapesArray",
    default: []
})

export const shapesChange = atom<boolean>({
    key: "shapesChange",
    default: false
})