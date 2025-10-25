import { useRecoilState, useSetRecoilState } from "recoil";
import {  shapesArray, shapesChange } from "../../recoil/atoms";
import { Shape } from "../types/types";
import { undo } from "../undo-redo/redo";
import { redo } from "../undo-redo/undo";

export function useUndoHandler() {
    const [shapes, setShapes] = useRecoilState(shapesArray);
    const setShapesChange = useSetRecoilState(shapesChange);

    const handleUndo = () => {
        if (undo.length == 0) return; // need at least two snapshots

        const last = undo.pop()!;
        redo.push(last);

        const prev = undo[undo.length - 1] || [] as Shape[];
        setShapes(prev);
        setShapesChange(true);
    };

    return handleUndo;
}
