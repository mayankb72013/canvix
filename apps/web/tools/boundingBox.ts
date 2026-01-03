import { Shape } from "../app/types/types";

export default function BoundingBox(ctx: React.RefObject<CanvasRenderingContext2D | null>, shape?: Shape, clearFlag: boolean = true) {

    if (clearFlag) {
        ctx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    ctx.current!.lineWidth = 2
    ctx.current!.strokeStyle = "#2684ff"
    ctx.current!.fillStyle = "#ffffff"

    let minX;
    let minY;
    let maxX;
    let maxY;

    const HANDLE_SIZE = 8;
    const HANDLE_HALF = HANDLE_SIZE / 2;
    const BOX_PADDING = 8;

    const ROTATION_HANDLE_RADIUS = 6;
    const ROTATION_HANDLE_OFFSET = 24;

    if (shape?.type === "text") {

    } else {
        minX = Math.min(shape?.startX!, shape?.endX!);
        minY = Math.min(shape?.startY!, shape?.endY!);
        maxX = Math.max(shape?.startX!, shape?.endX!);
        maxY = Math.max(shape?.startY!, shape?.endY!);
        //total box
        ctx.current!.strokeRect(minX! - BOX_PADDING, minY! - BOX_PADDING, maxX - minX! + BOX_PADDING * 2, maxY - minY + BOX_PADDING * 2);
        //border boxes

        // Top-Left
        ctx.current?.fillRect(minX! - BOX_PADDING - HANDLE_HALF, minY! - BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);
        ctx.current?.strokeRect(minX! - BOX_PADDING - HANDLE_HALF, minY! - BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);

        // Top-right
        ctx.current?.fillRect(maxX! + BOX_PADDING - HANDLE_HALF, minY! - BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);
        ctx.current?.strokeRect(maxX! + BOX_PADDING - HANDLE_HALF, minY! - BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);

        // Bottom-left
        ctx.current?.fillRect(minX! - BOX_PADDING - HANDLE_HALF, maxY! + BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);
        ctx.current?.strokeRect(minX! - BOX_PADDING - HANDLE_HALF, maxY! + BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);

        // Bottom-right
        ctx.current?.fillRect(maxX! + BOX_PADDING - HANDLE_HALF, maxY! + BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);
        ctx.current?.strokeRect(maxX! + BOX_PADDING - HANDLE_HALF, maxY! + BOX_PADDING - HANDLE_HALF, HANDLE_SIZE, HANDLE_SIZE);

        //------- Rotation-circle ---------
        const rotationX =
            (minX - BOX_PADDING + maxX + BOX_PADDING) / 2;

        const rotationY =
            minY - BOX_PADDING - ROTATION_HANDLE_OFFSET;

        // connector line
        ctx.current?.beginPath();
        ctx.current?.moveTo(
            rotationX,
            minY - BOX_PADDING
        );
        ctx.current?.lineTo(
            rotationX,
            rotationY
        );
        ctx.current?.stroke();

        // rotation circle
        ctx.current?.beginPath();
        ctx.current?.arc(
            rotationX,
            rotationY,
            ROTATION_HANDLE_RADIUS,
            0,
            Math.PI * 2
        );
        ctx.current?.fill();
        ctx.current?.stroke();
    }
}