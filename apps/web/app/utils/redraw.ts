import { useRecoilValue } from "recoil";
import { boxDraw } from "../../drawingLogic/box";
import { ellipseDraw } from "../../drawingLogic/ellipse";
import { lineDraw } from "../../drawingLogic/line";
import { pencilDraw } from "../../drawingLogic/pencil";
import { Shape } from "../types/types";
import { shapeSelected } from "../../recoil/atoms";

export function useRedrawCanvas() {

    const selectedShape = useRecoilValue(shapeSelected);

    function reDrawCanvas(mainCtx: React.RefObject<CanvasRenderingContext2D | null>, tempCtx: React.RefObject<CanvasRenderingContext2D | null>, shapes: Shape[], isResizing: boolean = false) {

        shapes.map(shape => {
            if (isResizing) {
                if (shape.id !== selectedShape?.id) {
                    if (shape.type === "pencil") {
                        pencilDraw(mainCtx, 0, 0, shape.path as Path2D, false, shape.strokeColor as string, shape.strokeWidth as number);
                    } else if (shape.type === "text") {
                        boxDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                    } else if (shape.type === "line") {
                        lineDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                    } else if (shape.type === "ellipse") {
                        ellipseDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                    } else if (shape.type === "box") {
                        boxDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                    }
                } else {
                    if (shape.type === "pencil") {
                        pencilDraw(mainCtx, 0, 0, selectedShape.path as Path2D, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                    } else if (shape.type === "text") {
                        boxDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                    } else if (shape.type === "line") {
                        lineDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                    } else if (shape.type === "ellipse") {
                        ellipseDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                    } else if (shape.type === "box") {
                        boxDraw(mainCtx, selectedShape.startX as number, selectedShape.startY as number, selectedShape.endX as number, selectedShape.endY as number, false, selectedShape.strokeColor as string, selectedShape.strokeWidth as number);
                    }
                }
            } else {
                if (shape.type === "pencil") {
                    pencilDraw(mainCtx, 0, 0, shape.path as Path2D, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "text") {
                    boxDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "line") {
                    lineDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "ellipse") {
                    ellipseDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                } else if (shape.type === "box") {
                    boxDraw(mainCtx, shape.startX as number, shape.startY as number, shape.endX as number, shape.endY as number, false, shape.strokeColor as string, shape.strokeWidth as number);
                }
            }
        })
    }
    return reDrawCanvas;
}