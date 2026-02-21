import { useRecoilState, useSetRecoilState } from "recoil";
import { shapesArray, shapeSelected, undoClicked } from "../../recoil/atoms";
import { EventType, Shape } from "@repo/types";
import { undo } from "../undo-redo/undo";
import { redo } from "../undo-redo/redo";
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

        let newShapes: Shape[] = [];

        if (last.type === "insertion") {
            newShapes = shapes.filter((s) => {
                if (s.id === last.shapeId) {
                    return false;
                }
                return true;
            })
        } else if (last.type === "updated") {
            newShapes = shapes.map((s) => {
                if (s.id === last.shapeId && last.initialShape !== undefined) {
                    return last.initialShape;
                }
                return s;
            });
        } else if (last.type === "delete") {
            if (last.initialShape) {
                newShapes = [...shapes, last.initialShape];
            }
        }

        setShapes(newShapes);
        setUndoClick(true);
    };

    return handleUndo;
}
