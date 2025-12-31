import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    activeHandle,
    cursorState,
    originalSnapshot,
    shapesArray,
    shapesChange,
    shapeSelected,
    strokeWidth,
} from "../recoil/atoms";
import { directions, Point, Shape } from "../app/types/types";
import BoundingBox from "./boundingBox";
import { useRedrawCanvas } from "../app/utils/redraw";

export interface HandleType {
    id: directions;
    centerX: number;
    centerY: number;
    hitX: number;
    hitY: number;
    width: number;
    height: number;
}

const HANDLE_SIZE = 8;
const HANDLE_HALF = HANDLE_SIZE / 2;
const BOX_PADDING = 8;

export default function useResizeRotate(): [
    (
        ctx: React.RefObject<CanvasRenderingContext2D | null>,
        clientX: number,
        clientY: number
    ) => void,
    (
        mainCtx: React.RefObject<CanvasRenderingContext2D | null>,
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
    const [currentActiveHandle, setCurrentActiveHandle] =
        useRecoilState(activeHandle);
    const handleRedrawCanvas = useRedrawCanvas();

    let boundsLeft: number | undefined;
    let boundsTop: number | undefined;
    let boundsRight: number | undefined;
    let boundsBottom: number | undefined;

    function handleResizeRotate(

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

        const resizeHandles = [
            northWestHandle,
            northEastHandle,
            southWestHandle,
            southEastHandle,
        ];

        for (const handle of resizeHandles) {
            if (
                clientX >= handle.hitX &&
                clientX <= handle.hitX + handle.width &&
                clientY >= handle.hitY &&
                clientY <= handle.hitY + handle.height
            ) {
                if (handle.id === "sw" || handle.id === "ne") {
                    setCurrentCursor("cursor-nesw-resize");
                } else {
                    setCurrentCursor("cursor-nwse-resize");
                }
                setCurrentActiveHandle(handle);
            }
        }

        ctx.current!.restore();
    }

    function handleClick(
        mainCtx: React.RefObject<CanvasRenderingContext2D | null>,
        tempCtx: React.RefObject<CanvasRenderingContext2D | null>,
        clientX: number,
        clientY: number
    ) {
        if (!initialShape || !currentActiveHandle) return;

        let anchorX: number;
        let anchorY: number;
        let currentHandleX: number;
        let currentHandleY: number;
        let Tx: number;
        let Ty: number;

        if (currentActiveHandle.id === "nw") {
            anchorX = initialShape.endX!;
            anchorY = initialShape.endY!;
            currentHandleX = clientX + BOX_PADDING;
            currentHandleY = clientY + BOX_PADDING;
        } else if (currentActiveHandle.id === "ne") {
            anchorX = initialShape.startX!;
            anchorY = initialShape.endY!;
            currentHandleX = clientX - BOX_PADDING;
            currentHandleY = clientY + BOX_PADDING;
        } else if (currentActiveHandle.id === "sw") {
            anchorX = initialShape.endX!;
            anchorY = initialShape.startY!;
            currentHandleX = clientX + BOX_PADDING;
            currentHandleY = clientY - BOX_PADDING;
        } else {
            anchorX = initialShape.startX!;
            anchorY = initialShape.startY!;
            currentHandleX = clientX - BOX_PADDING;
            currentHandleY = clientY - BOX_PADDING;
        }

        if (initialShape.type === "pencil") {
            console.log("Initial: "+initialShape.pointsInPath);
            console.log("Selected: "+selectedShape?.pointsInPath)
            Tx = currentActiveHandle.centerX - anchorX;
            Ty = currentActiveHandle.centerY - anchorY;
            if (Tx === 0 || Ty === 0) return;

            let currentX = currentHandleX - anchorX;
            let currentY = currentHandleY - anchorY;

            let scaleX = currentX / Tx;
            let scaleY = currentY / Ty;

            let points = initialShape.pointsInPath?.map(point => ({
                x: anchorX + (point.x - anchorX) * scaleX,
                y: anchorY + (point.y - anchorY) * scaleY
            }));
            let newMinX = anchorX + (initialShape.startX! - anchorX)*scaleX;
            let newMinY = anchorY + (initialShape.startY! - anchorY)*scaleY;
            let newMaxX = anchorX + (initialShape.endX! - anchorX)*scaleX;
            let newMaxY = anchorY + (initialShape.endY! - anchorY)*scaleY;

            if (points !== undefined) {
                const newPath = new Path2D();
                if (points.length === 0) return;

                tempCtx.current?.save();
                newPath.moveTo(points[0]?.x!, points[0]?.y!);
                for (let i = 1; i < points.length; i++) {
                    newPath.lineTo(points[i]?.x!, points[i]?.y!);
                }
                let updatedShape: Shape | null = null;
                updatedShape = {
                    ...initialShape,
                    path: newPath,
                    pointsInPath: points,
                    startX: newMinX,
                    startY: newMinY,
                    endX: newMaxX,
                    endY: newMaxY
                }

                if (updatedShape) {
                    setSelectedShape(updatedShape);
                    mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                    tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                    handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
                    BoundingBox(tempCtx, updatedShape, false);
                }

            }
        } else if (initialShape.type === "text") {

        } else {
            const startX = Math.min(anchorX, currentHandleX);
            const startY = Math.min(anchorY, currentHandleY);
            const endX = Math.max(anchorX, currentHandleX);
            const endY = Math.max(anchorY, currentHandleY);

            let updatedShape: Shape | null = null;


            updatedShape = {
                ...initialShape,
                startX,
                startY,
                endX,
                endY,
            };


            if (updatedShape) {
                setSelectedShape(updatedShape);
                mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
                BoundingBox(tempCtx, updatedShape, false);
            }
            // if (initialShape.type === "box") {
            // } else if (initialShape.type === "ellipse") {

            // } else if (initialShape.type === "line") {

            // }
        }
    }
    return [handleResizeRotate, handleClick];
}


