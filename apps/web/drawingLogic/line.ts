import { MouseEvent } from "react";

export function lineDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>, startX: number, startY: number, endX: number, endY: number, clearFlag: boolean, strokeColor: string, strokeWidth: number, coordinates?: { startX: number, startY: number, endX: number, endY: number }) {
    ctx.current!.lineWidth = strokeWidth
    ctx.current!.strokeStyle = strokeColor

    if (clearFlag) {
        ctx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    if (coordinates) {
        ctx.current!.beginPath();
        ctx.current!.moveTo(coordinates.startX, coordinates.startY);
        ctx.current!.lineTo(coordinates.endX, coordinates.endY);
        ctx.current!.stroke();
    } else {
        ctx.current!.beginPath();
        ctx.current!.moveTo(startX, startY);
        ctx.current!.lineTo(endX, endY);
        ctx.current!.stroke();
    }
}