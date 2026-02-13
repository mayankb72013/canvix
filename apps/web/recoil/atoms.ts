import { atom } from "recoil";
import { CursorTypes, directions, Shape, Tools, Types } from "@repo/types";
import { devNull } from "node:os";
import { HandleType } from "../tools/resizeRotateHover";

export const toolSelected = atom<Types | Tools>({
    key: "toolSelected",
    default: "select"
})

// export const shapeId = atom<number>({
//     key: "shapeId",
//     default: 0
// })

export const shapeSelected = atom<Shape | undefined>({
    key: "shapeSelected",
    default: undefined
})

export const originalSnapshot = atom<Shape | undefined>({
    key: "originalSnapshot",
    default: undefined
})

export const activeHandle = atom<HandleType>({
    key: "activeHandle",
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

export const undoClicked = atom<boolean>({
    key: "undoClicked",
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