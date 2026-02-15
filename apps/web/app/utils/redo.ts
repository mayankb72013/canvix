import { useRecoilState } from "recoil";
import { shapesArray, } from "../../recoil/atoms";
import { redo } from "../undo-redo/redo";
import { Shape } from "@repo/types";
import { undo } from "../undo-redo/undo";

export function useRedoHandler() {

    const [shapes, setShapes] = useRecoilState(shapesArray);

    const handleRedo = () => {
        if (redo.length > 0) {
            const popped = redo.pop() as Shape[];
            undo.push(popped);
            setShapes(popped);
        }
    }

    return handleRedo
}