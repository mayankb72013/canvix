export function pencilDraw(ctx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number, currentPath: Path2D, isDrawing: boolean) {
    ctx.current!.lineWidth = 5;
    ctx.current!.lineCap = "round"

    // ctx.current!.lineTo(clientX, clientY);
    // ctx.current!.stroke();
    // ctx.current!.beginPath();
    // ctx.current!.moveTo(clientX, clientY);

    if (isDrawing) {
        currentPath!.lineTo(clientX, clientY);
        ctx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.current!.stroke(currentPath);
    } else {
        ctx.current!.stroke(currentPath);
    }

}