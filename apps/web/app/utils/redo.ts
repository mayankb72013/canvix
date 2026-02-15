import { useRecoilState } from "recoil";
import { shapesArray, } from "../../recoil/atoms";
import { redo } from "../undo-redo/redo";
import { EventType, Shape } from "@repo/types";
import { undo } from "../undo-redo/undo";

export function useRedoHandler() {

    const [shapes, setShapes] = useRecoilState(shapesArray);

    const handleRedo = () => {
        if (redo.length > 0) {
            const popped = redo.pop() as EventType;
            undo.push(popped);

            let newShapes: Shape[] = [];

            if (popped.type === "delete") {
                newShapes = shapes.filter((s) => {
                    if (s.id === popped.shapeId) {
                        return false;
                    }
                    return true;
                })
            } else if (popped.type === "updated") {
                newShapes = shapes.map((s) => {
                    if (s.id === popped.shapeId && popped.updatedShape !== undefined) {
                        return popped.updatedShape;
                    }
                    return s;
                });
            } else if (popped.type === "insertion") {
                if (popped.updatedShape !== undefined) {
                    newShapes = [...shapes, popped.updatedShape];
                }
            }

            setShapes(newShapes);
        }
    }

    return handleRedo
}