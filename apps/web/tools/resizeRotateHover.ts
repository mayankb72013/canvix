import { useRecoilValue, useSetRecoilState } from "recoil";
import { cursorState, shapeSelected, strokeWidth } from "../recoil/atoms";
import { CursorTypes, directions } from "../app/types/types";

interface HandleType {
    id: directions,
    cx: number,
    cy: number,
    x: number,
    y: number,
    width: number,
    height: number,
}

export default function useResizeRotateHover() {
    const selectedShape = useRecoilValue(shapeSelected);
    const setCurrentCursor = useSetRecoilState(cursorState);
    const lineWidth = useRecoilValue(strokeWidth);

    // each of the above handles is a json object about the details of the handle like center coordinates, widths etc.
    // calculate the values here itself for the shape so as to not cause re-calculations everytime.

    const HANDLE_SIZE = 8;
    const HANDLE_HALF = HANDLE_SIZE / 2;
    const BOX_PADDING = 8;




    function handleResizeRotateHover(ctx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number,) {
        ctx.current?.save();
        ctx.current!.lineWidth = Math.max(10,lineWidth + 8);
        
        // normalized bounds
        if (selectedShape === undefined) return ;
        const minX = Math.min(selectedShape.startX!, selectedShape.endX!);
        const minY = Math.min(selectedShape.startY!, selectedShape.endY!);
        const maxX = Math.max(selectedShape.startX!, selectedShape.endX!);
        const maxY = Math.max(selectedShape.startY!, selectedShape.endY!);

        // handle centers
        const nwCX = minX - BOX_PADDING;
        const nwCY = minY - BOX_PADDING;

        const neCX = maxX + BOX_PADDING;
        const neCY = minY - BOX_PADDING;

        const swCX = minX - BOX_PADDING;
        const swCY = maxY + BOX_PADDING;

        const seCX = maxX + BOX_PADDING;
        const seCY = maxY + BOX_PADDING;

        // computed handle JSONs
        const nw: HandleType = {
            id: "nw",
            cx: nwCX,
            cy: nwCY,
            x: nwCX - HANDLE_HALF,
            y: nwCY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const ne: HandleType = {
            id: "ne",
            cx: neCX,
            cy: neCY,
            x: neCX - HANDLE_HALF,
            y: neCY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const sw: HandleType = {
            id: "sw",
            cx: swCX,
            cy: swCY,
            x: swCX - HANDLE_HALF,
            y: swCY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const se: HandleType = {
            id: "se",
            cx: seCX,
            cy: seCY,
            x: seCX - HANDLE_HALF,
            y: seCY - HANDLE_HALF,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
        };

        const resizeHandles = [nw, ne, sw, se];
        // now check the clientX and clientY if they are in the area of the box that encloses the resize handles
        // if yes then we just change the cursor.

        for (const handle of resizeHandles) {
            if (
                clientX >= handle.x &&
                clientX <= handle.x + handle.width &&
                clientY >= handle.y &&
                clientY <= handle.y + handle.height
            ) {
                if (handle.id === "sw" || handle.id === "ne") {
                    setCurrentCursor("cursor-nesw-resize")
                } else {
                    setCurrentCursor("cursor-nwse-resize")
                }
            }
        }

        ctx.current!.restore();
    }

    return handleResizeRotateHover;
}