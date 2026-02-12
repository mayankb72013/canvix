import { useRecoilState, useSetRecoilState } from "recoil";
import {  shapesArray,  shapeSelected, undoClicked } from "../../recoil/atoms";
import { Shape } from "../types/types";
import { undo } from "../undo-redo/redo";
import { redo } from "../undo-redo/undo";
import BoundingBox from "../../tools/boundingBox";

export function useUndoHandler() {
    const [shapes, setShapes] = useRecoilState(shapesArray);
    const [selectedShape, setSelectedShape] = useRecoilState(shapeSelected);
    const setUndoClick = useSetRecoilState(undoClicked);

    const handleUndo = () => {
        if (undo.length == 0) return; // need at least two snapshots

        if (selectedShape !== undefined) {
            setSelectedShape(undefined);
        }

        const last = undo.pop()!;
        redo.push(last);

        const prev = undo[undo.length - 1] || [] as Shape[];
        setShapes(prev);
        setUndoClick(true);
    };

    return handleUndo;
}
