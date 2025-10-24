import { atom } from "recoil";

export const toolSelected = atom({
    key: "toolSelected",
    default: "pencil"
})

export const clearCanvas = atom({
    key: "clearCanvas",
    default: false
})