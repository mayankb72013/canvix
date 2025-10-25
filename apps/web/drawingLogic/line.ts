import { MouseEvent } from "react";

export function lineDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>,startX: number,startY: number,endX: number, endY: number, clearFlag: boolean,strokeColor: string, strokeWidth: number) {
    ctx.current!.lineWidth=strokeWidth
    ctx.current!.strokeStyle=strokeColor

    if (clearFlag) {
        ctx.current!.clearRect(0,0,window.innerWidth,window.innerHeight);
    }
    ctx.current!.beginPath();
    ctx.current!.moveTo(startX,startY);
    ctx.current!.lineTo(endX,endY);
    ctx.current!.stroke();
}