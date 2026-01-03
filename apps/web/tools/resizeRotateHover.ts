import { useRecoilValue, useSetRecoilState } from "recoil";
import {
    cursorState,
    shapeSelected,
    strokeWidth,
} from "../recoil/atoms";
import { directions } from "../app/types/types";
import { toLocalMouse } from "./locateMouse";

const HANDLE_SIZE = 8;
const HANDLE_HALF = HANDLE_SIZE / 2;
const BOX_PADDING = 8;

const ROTATION_HANDLE_RADIUS = 6;
const ROTATION_HANDLE_OFFSET = 24;

export interface HandleType {
    id: directions;
    centerX: number;
    centerY: number;
    hitX: number;
    hitY: number;
    width: number;
    height: number;
}

export default function useResizeRotateHover(): (
    ctx: React.RefObject<CanvasRenderingContext2D | null>,
    clientX: number,
    clientY: number
) => void {
    const selectedShape = useRecoilValue(shapeSelected);
    const setCurrentCursor = useSetRecoilState(cursorState);
    const lineWidth = useRecoilValue(strokeWidth);

    let boundsLeft: number | undefined;
    let boundsTop: number | undefined;
    let boundsRight: number | undefined;
    let boundsBottom: number | undefined;

    function handleResizeRotateHover(
        ctx: React.RefObject<CanvasRenderingContext2D | null>,
        clientX: number,
        clientY: number
    ) {
        ctx.current?.save();
        ctx.current!.lineWidth = Math.max(10, lineWidth + 8);

        if (!selectedShape) return;

        boundsLeft = Math.min(selectedShape.startX!, selectedShape.endX!);
        boundsTop = Math.min(selectedShape.startY!, selectedShape.endY!);
        boundsRight = Math.max(selectedShape.startX!, selectedShape.endX!);
        boundsBottom = Math.max(selectedShape.startY!, selectedShape.endY!);

        const rotationCenterX =
            (boundsLeft - BOX_PADDING + boundsRight + BOX_PADDING) / 2;
        const rotationCenterY =
            boundsTop - BOX_PADDING - ROTATION_HANDLE_OFFSET;

        const northWestCenterX = boundsLeft - BOX_PADDING;
        const northWestCenterY = boundsTop - BOX_PADDING;

        const northEastCenterX = boundsRight + BOX_PADDING;
        const northEastCenterY = boundsTop - BOX_PADDING;

        const southWestCenterX = boundsLeft - BOX_PADDING;
        const southWestCenterY = boundsBottom + BOX_PADDING;

        const southEastCenterX = boundsRight + BOX_PADDING;
        const southEastCenterY = boundsBottom + BOX_PADDING;

        const northWestHandle: HandleType = {
            id: "nw",
            centerX: northWestCenterX,
            centerY: northWestCenterY,
            hitX: northWestCenterX - HANDLE_HALF,
            hitY: northWestCenterY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const northEastHandle: HandleType = {
            id: "ne",
            centerX: northEastCenterX,
            centerY: northEastCenterY,
            hitX: northEastCenterX - HANDLE_HALF,
            hitY: northEastCenterY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const southWestHandle: HandleType = {
            id: "sw",
            centerX: southWestCenterX,
            centerY: southWestCenterY,
            hitX: southWestCenterX - HANDLE_HALF,
            hitY: southWestCenterY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const southEastHandle: HandleType = {
            id: "se",
            centerX: southEastCenterX,
            centerY: southEastCenterY,
            hitX: southEastCenterX - HANDLE_HALF,
            hitY: southEastCenterY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const rotationHandle: HandleType = {
            id: "rotate",
            centerX: rotationCenterX,
            centerY: rotationCenterY,
            hitX: rotationCenterX - ROTATION_HANDLE_RADIUS,
            hitY: rotationCenterY - ROTATION_HANDLE_RADIUS,
            width: ROTATION_HANDLE_RADIUS * 2,
            height: ROTATION_HANDLE_RADIUS * 2,
        };

        const resizeHandles = [
            northWestHandle,
            northEastHandle,
            southWestHandle,
            southEastHandle,
            rotationHandle,
        ];

        for (const handle of resizeHandles) {
            const { x, y } = toLocalMouse(clientX, clientY, selectedShape);

            if (
                x >= handle.hitX &&
                x <= handle.hitX + handle.width &&
                y >= handle.hitY &&
                y <= handle.hitY + handle.height
            ) {
                if (handle.id === "sw" || handle.id === "ne") {
                    setCurrentCursor("cursor-nesw-resize");
                } else if (handle.id === "se" || handle.id === "nw") {
                    setCurrentCursor("cursor-nwse-resize");
                } else if (handle.id === "rotate") {
                    setCurrentCursor("cursor-grab");
                }
                break;
            }
        }

        // console.log("Reached");
        ctx.current!.restore();
    }

    return handleResizeRotateHover;
}
