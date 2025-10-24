import { MouseEvent } from "react";

export function ellipseDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>, startX: number, startY: number, e: MouseEvent, clearFlag: boolean) {
//     ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)

    ctx.current!.lineWidth=5;

    const x = (Math.abs(startX+e.clientX)/2) as number;
    const y = (Math.abs(startY+e.clientY)/2) as number;

    const radiusX = Math.abs(startX-e.clientX)/2;
    const radiusY = Math.abs(startY-e.clientY)/2;

    const startAngle = 0;
    const endAngle = 2*Math.PI;

    if (clearFlag) {
        ctx.current!.clearRect(0,0,window.innerWidth,window.innerHeight);
    }
    ctx.current!.beginPath();
    ctx.current!.ellipse(x,y,radiusX,radiusY,0,startAngle,endAngle);
    ctx.current!.stroke();

}