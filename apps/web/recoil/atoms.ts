import { atom } from "recoil";
import { Shape, Tools, Types } from "../app/types/types";

export const toolSelected = atom<Types | Tools>({
    key: "toolSelected",
    default: "select"
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

export const crosshairState = atom<boolean>({
    key: "crosshairState",
    default: false
})

export const strokeColor = atom({
    key: "strokeColor",
    default: '#000000'
})

export const strokeWidth = atom({
    key: "strokeWidth",
    default: 4
})