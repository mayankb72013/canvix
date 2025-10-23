import { MouseEvent } from "react";

export function boxDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>,startX: number,startY: number,e: MouseEvent) {

    const mouseX = e.clientX-startX;
    const mouseY = e.clientY-startY;
    
    ctx.current!.strokeStyle="black"
    ctx.current!.clearRect(0,0,window.innerWidth,window.innerHeight);
    ctx.current!.strokeRect(startX,startY,mouseX,mouseY);
    // ctx.current!.beginPath();
}