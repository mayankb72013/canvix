import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { activeHandle, cursorState, originalSnapshot, shapesArray, shapesChange, shapeSelected, strokeWidth } from "../recoil/atoms";
import { CursorTypes, directions, Shape } from "../app/types/types";
import { reDrawCanvas } from "../app/utils/redraw";
import BoundingBox from "./boundingBox";

interface HandleType {
    id: directions,
    cx: number,
    cy: number,
    x: number,
    y: number,
    width: number,
    height: number,
}
const HANDLE_SIZE = 8;
const HANDLE_HALF = HANDLE_SIZE / 2;
const BOX_PADDING = 8;

export default function useResizeRotate(): [
    (
      tempCtx: React.RefObject<CanvasRenderingContext2D | null>,
      clientX: number,
      clientY: number
    ) => void,
    (
      tempCtx: React.RefObject<CanvasRenderingContext2D | null>,
      clientX: number,
      clientY: number
    ) => void
  ] {
    const [selectedShape, setSelectedShape] = useRecoilState(shapeSelected);
    const initialShape = useRecoilValue(originalSnapshot);
    const setCurrentCursor = useSetRecoilState(cursorState);
    const lineWidth = useRecoilValue(strokeWidth);
    const setShapesChange = useSetRecoilState(shapesChange);
    const [shapes, setShapes] = useRecoilState(shapesArray);
    const [currentActiveHandle, setCurrentActiveHandle] = useRecoilState(activeHandle);

    // each of the above handles is a json object about the details of the handle like center coordinates, widths etc.
    // calculate the values here itself for the shape so as to not cause re-calculations everytime.


    let minX: number | undefined, minY: number | undefined, maxX: number | undefined, maxY: number | undefined;

    function handleResizeRotate(ctx: React.RefObject<CanvasRenderingContext2D | null>,  clientX: number, clientY: number,) {
        ctx.current?.save();
        ctx.current!.lineWidth = Math.max(10, lineWidth + 8);

        // normalized bounds
        if (selectedShape === undefined) return;
        minX = Math.min(selectedShape.startX!, selectedShape.endX!);
        minY = Math.min(selectedShape.startY!, selectedShape.endY!);
        maxX = Math.max(selectedShape.startX!, selectedShape.endX!);
        maxY = Math.max(selectedShape.startY!, selectedShape.endY!);

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
                setCurrentActiveHandle(handle.id);
            }
        }


        ctx.current!.restore();
    }

    function handleClick(tempCtx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number) {
        if (!initialShape) return;

        let anchorX: number;
        let anchorY: number;
        let movingX: number;
        let movingY: number;

        if (currentActiveHandle === "nw") {
            anchorX = initialShape.endX!;
            anchorY = initialShape.endY!;
            movingX = clientX + BOX_PADDING;
            movingY = clientY + BOX_PADDING;

        } else if (currentActiveHandle === "ne") {
            anchorX = initialShape.startX!;
            anchorY = initialShape.endY!;
            movingX = clientX - BOX_PADDING;
            movingY = clientY + BOX_PADDING;

        } else if (currentActiveHandle === "sw") {
            anchorX = initialShape.endX!;
            anchorY = initialShape.startY!;
            movingX = clientX + BOX_PADDING;
            movingY = clientY - BOX_PADDING;

        } else {
            // se
            anchorX = initialShape.startX!;
            anchorY = initialShape.startY!;
            movingX = clientX - BOX_PADDING;
            movingY = clientY - BOX_PADDING;
        }

        const startX = Math.min(anchorX, movingX);
        const startY = Math.min(anchorY, movingY);
        const endX = Math.max(anchorX, movingX);
        const endY = Math.max(anchorY, movingY);

        if (initialShape.type === "text") {

        } else if (initialShape.type === "pencil") {

        } else {
            if (initialShape.type === "box") {
                let currentShape: Shape | null = null;
                const newShapes: Shape[] = shapes.map((shape) => {
                    if (shape.id === initialShape.id) {
                        currentShape = {
                            ...initialShape,
                            startX,
                            startY,
                            endX,
                            endY,
                        };
                        return currentShape;
                    }
                    return shape;
                });

                if (currentShape) {
                    setSelectedShape(currentShape);
                    BoundingBox(tempCtx, currentShape);
                }
                setShapes(newShapes);
                setShapesChange(true);


            } else if (initialShape.type === "ellipse") {

            } else if (initialShape.type === "line") {

            }
        }
    }
    return [handleResizeRotate, handleClick];
}

