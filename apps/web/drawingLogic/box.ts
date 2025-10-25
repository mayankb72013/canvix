import { MouseEvent } from "react";

export function boxDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>,startX: number,startY: number,endX: number, endY: number, clearFlag: boolean, strokeColor: string, strokeWidth: number) {

    const mouseX = endX-startX;
    const mouseY = endY-startY;
    
    ctx.current!.lineWidth=strokeWidth
    ctx.current!.strokeStyle=strokeColor

    if (clearFlag) {
        ctx.current!.clearRect(0,0,window.innerWidth,window.innerHeight);
    }
    ctx.current!.strokeRect(startX,startY,mouseX,mouseY);
    // ctx.current!.beginPath();
}