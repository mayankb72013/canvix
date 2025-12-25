import { Shape } from "../app/types/types";

export default function BoundingBox(ctx: React.RefObject<CanvasRenderingContext2D | null>, shape?: Shape, clearFlag?: boolean) {

    if (clearFlag) {
        ctx.current?.clearRect(0,0,window.innerWidth,window.innerHeight);
    }
    ctx.current!.lineWidth = 2
    ctx.current!.strokeStyle = "#2684ff"
    ctx.current!.fillStyle = "#ffffff"

    if (shape?.type === "text") {

    } else if (shape?.type === "pencil") {

    } else {
        if (shape?.type === "box") {
            //total box
            ctx.current!.strokeRect(shape?.startX!-6, shape?.startY!-6, shape?.endX!-shape?.startX!+12, shape?.endY!-shape?.startY!+12);

            //border boxes

            // Top-Left
            ctx.current?.fillRect(shape.startX!-10,shape.startY!-10,7,7);
            ctx.current?.strokeRect(shape.startX!-10,shape.startY!-10,7,7);
            
            // Top-right
            ctx.current?.fillRect(shape.endX!+3,shape.startY!-10,7,7);
            ctx.current?.strokeRect(shape.endX!+3,shape.startY!-10,7,7);
            
            // Bottom-left
            ctx.current?.fillRect(shape.startX!-10,shape.endY!+3,7,7);
            ctx.current?.strokeRect(shape.startX!-10,shape.endY!+3,7,7);
            
            // Bottom-right
            ctx.current?.fillRect(shape.endX!+3,shape.endY!+3,7,7);
            ctx.current?.strokeRect(shape.endX!+3,shape.endY!+3,7,7);

        } else if (shape?.type === "ellipse") {

        } else if (shape?.type === "line") {

        }
    }
}