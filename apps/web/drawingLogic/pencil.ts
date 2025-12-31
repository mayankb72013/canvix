import { Point } from "../app/types/types";

export function pencilDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number, currentPath: Path2D, isDrawing: boolean,  strokeColor: string, strokeWidth: number) {
    ctx.current!.lineCap = "round"
    ctx.current!.lineWidth = strokeWidth
    ctx.current!.strokeStyle = strokeColor

    // ctx.current!.lineTo(clientX, clientY);
    // ctx.current!.stroke();
    // ctx.current!.beginPath();
    // ctx.current!.moveTo(clientX, clientY);

    if (isDrawing) {
        currentPath.lineTo(clientX, clientY);
        ctx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.current!.stroke(currentPath);
        console.log("While drawing : "+currentPath);
    } else {
        console.log("In draw function: "+currentPath);
        ctx.current!.stroke(currentPath);
    } 

}