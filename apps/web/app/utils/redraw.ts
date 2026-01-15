import { useRecoilValue } from "recoil";
import { boxDraw } from "../../drawingLogic/box";
import { ellipseDraw } from "../../drawingLogic/ellipse";
import { lineDraw } from "../../drawingLogic/line";
import { pencilDraw } from "../../drawingLogic/pencil";
import { Shape } from "../types/types";
import { originalSnapshot, shapeSelected } from "../../recoil/atoms";
import BoundingBox from "../../tools/boundingBox";

export function useRedrawCanvas() {

    const selectedShape = useRecoilValue(shapeSelected);
    // const initialShape = useRecoilValue(originalSnapshot);

    function reDrawCanvas(mainCtx: React.RefObject<CanvasRenderingContext2D | null>, tempCtx: React.RefObject<CanvasRenderingContext2D | null>, shapes: Shape[], isResizing: boolean = false, isRotating: boolean = false) {

        shapes.map(shape => {

            if (shape.id !== selectedShape?.id) {
                const centerX = (shape?.startX! + shape?.endX!) / 2;
                const centerY = (shape?.startY! + shape?.endY!) / 2;

                mainCtx.current?.save();
                tempCtx.current?.save();

                mainCtx.current?.translate(centerX, centerY);
                mainCtx.current?.rotate(shape.rotation as number);
                mainCtx.current?.translate(-centerX, -centerY);

                tempCtx.current?.translate(centerX, centerY);
                tempCtx.current?.rotate(shape.rotation as number);
                tempCtx.current?.translate(-centerX, -centerY);

                if (shape.type === "pencil") {
                    pencilDraw(mainCtx, 0, 0, shape.path as Path2D, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "text") {
                    boxDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "line") {
                    if (shape.lineCoordinates) {
                        lineDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number,shape.lineCoordinates);
                    }
                    // lineDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "ellipse") {
                    ellipseDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "box") {
                    boxDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                }

                tempCtx.current?.setTransform(1, 0, 0, 1, 0, 0);
                mainCtx.current?.setTransform(1, 0, 0, 1, 0, 0);

                // tempCtx.current?.restore();
                // mainCtx.current?.restore();
            } else {
                const centerX = (selectedShape?.startX! + selectedShape?.endX!) / 2;
                const centerY = (selectedShape?.startY! + selectedShape?.endY!) / 2;

                mainCtx.current?.save();
                tempCtx.current?.save();

                mainCtx.current?.translate(centerX, centerY);
                mainCtx.current?.rotate(selectedShape.rotation as number);
                mainCtx.current?.translate(-centerX, -centerY);

                tempCtx.current?.translate(centerX, centerY);
                tempCtx.current?.rotate(selectedShape.rotation as number);
                tempCtx.current?.translate(-centerX, -centerY);

                if (shape.type === "pencil") {
                    pencilDraw(mainCtx, 0, 0, selectedShape.path as Path2D, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                } else if (shape.type === "text") {
                    boxDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                } else if (shape.type === "line") {
                    if (selectedShape.lineCoordinates) {
                        lineDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number, selectedShape.lineCoordinates);
                    }
                    // lineDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                } else if (shape.type === "ellipse") {
                    ellipseDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                } else if (shape.type === "box") {
                    boxDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                }
                BoundingBox(tempCtx, selectedShape, false);

                tempCtx.current?.restore();
                mainCtx.current?.restore();
            }
        })
    }
    return reDrawCanvas;
}