export function pencilDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number) {
    ctx.current!.lineWidth = 5;
    ctx.current!.lineCap = "round"

    ctx.current!.lineTo(clientX, clientY);
    ctx.current!.stroke();
    ctx.current!.beginPath();
    ctx.current!.moveTo(clientX, clientY);
}