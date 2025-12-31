import { boxDraw } from "../../drawingLogic/box";
import { ellipseDraw } from "../../drawingLogic/ellipse";
import { lineDraw } from "../../drawingLogic/line";
import { pencilDraw } from "../../drawingLogic/pencil";
import { Shape } from "../types/types";

export function reDrawCanvas(ctx: React.RefObject<CanvasRenderingContext2D | null>, shapes: Shape[]) {
    
    shapes.map(shape => {
        if (shape.type === "pencil") {
            pencilDraw(ctx,0,0, shape.path as Path2D, false,shape.strokeColor as string,shape.strokeWidth as number);
        } else if (shape.type === "text") {
            boxDraw(ctx, shape.startX as number, shape.startY as number, shape.endX as number,shape.endY as number, false, shape.strokeColor as string,shape.strokeWidth as number);
        } else if (shape.type === "line") {
            lineDraw(ctx, shape.startX as number, shape.startY as number, shape.endX as number,shape.endY as number, false,shape.strokeColor as string,shape.strokeWidth as number);
        } else if (shape.type === "ellipse") {
            ellipseDraw(ctx, shape.startX as number, shape.startY as number, shape.endX as number,shape.endY as number, false,shape.strokeColor as string,shape.strokeWidth as number);
        } else if (shape.type === "box") {
            boxDraw(ctx, shape.startX as number, shape.startY as number, shape.endX as number,shape.endY as number, false,shape.strokeColor as string,shape.strokeWidth as number);
        }
    }) 
    console.log(shapes);
}