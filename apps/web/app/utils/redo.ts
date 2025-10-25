import { useRecoilState } from "recoil";
import { shapesArray, shapesChange, } from "../../recoil/atoms";
import { redo } from "../undo-redo/undo";
import { Shape } from "../types/types";
import { undo } from "../undo-redo/redo";

export function useRedoHandler() {

    const [shapes, setShapes] = useRecoilState(shapesArray);
    const [shapesChanged, setShapesChanged] = useRecoilState(shapesChange);

    const handleRedo = () => {
        if (redo.length > 0) {
            const popped = redo.pop() as Shape[];
            undo.push(popped);
            setShapes(popped);
            setShapesChanged(true);
        }
    }

    return handleRedo
}