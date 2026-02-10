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
import { Shape } from "../app/types/types";
import { useRedrawCanvas } from "../app/utils/redraw";
import { HandleType } from "./resizeRotateHover";
import { useRef } from "react";
import { toLocalMouse, toWorldPoint } from "./Mouse";

const HANDLE_SIZE = 8;
const HANDLE_HALF = HANDLE_SIZE / 2;
const BOX_PADDING = 8;

const ROTATION_HANDLE_RADIUS = 6;
const ROTATION_HANDLE_OFFSET = 24;


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

    const resizeBase = useRef<Shape>();
    const resizeRotation = useRef<number>();
    const resizeCenter = useRef<{ x: number, y: number }>();
    const localAnchor = useRef<{ x: number, y: number }>();
    const resizeBounds = useRef<{ minX: number, minY: number, maxX: number, maxY: number }>();
    const resizeFlipRef = useRef<{ x: number, y: number }>();

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

        const rotationCenterX = (boundsLeft - BOX_PADDING + boundsRight + BOX_PADDING) / 2;
        const rotationCenterY = boundsTop - BOX_PADDING - ROTATION_HANDLE_OFFSET;

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
            const { x: localMouseX, y: localMouseY } = toLocalMouse(clientX, clientY, selectedShape);
            if (
                localMouseX >= handle.hitX &&
                localMouseX <= handle.hitX + handle.width &&
                localMouseY >= handle.hitY &&
                localMouseY <= handle.hitY + handle.height
            ) {

                if (handle.id === "sw" || handle.id === "ne") {
                    setCurrentCursor("cursor-nesw-resize");
                } else if (handle.id === "se" || handle.id === "nw") {
                    setCurrentCursor("cursor-nwse-resize");
                } else if (handle.id === "rotate") {
                    setCurrentCursor("cursor-grab");
                }
                setCurrentActiveHandle(handle);



                resizeBase.current = selectedShape;
                resizeRotation.current = selectedShape.rotation;
                let cx = (resizeBase.current.startX! + resizeBase.current.endX!) / 2;
                let cy = (resizeBase.current.startY! + resizeBase.current.endY!) / 2;

                resizeCenter.current = { x: cx, y: cy };

                const minX = Math.min(boundsLeft!, boundsRight!);
                const minY = Math.min(boundsTop!, boundsBottom!);
                const maxX = Math.max(boundsLeft!, boundsRight!);
                const maxY = Math.max(boundsTop!, boundsBottom!);

                resizeBounds.current = { minX, minY, maxX, maxY }

                resizeFlipRef.current = {
                    x: handle.id === "ne" || handle.id === "se" ? 1 : -1,
                    y: handle.id === "sw" || handle.id === "se" ? 1 : -1
                };

                if (handle.id === "ne") {
                    localAnchor.current = { x: minX, y: maxY };
                } else if (handle.id === "se") {
                    localAnchor.current = { x: minX, y: minY };
                } else if (handle.id === "nw") {
                    localAnchor.current = { x: maxX, y: maxY };
                } else if (handle.id === "sw") {
                    localAnchor.current = { x: maxX, y: minY };
                }
            }
        }

        ctx.current!.restore();
    }

    function handleResize(
        mainCtx: React.RefObject<CanvasRenderingContext2D | null>,
        tempCtx: React.RefObject<CanvasRenderingContext2D | null>,
        clientX: number,
        clientY: number
    ) {
        if (!initialShape || !currentActiveHandle) return;

        // let anchorX: number;
        // let anchorY: number;
        let currentHandleX: number;
        let currentHandleY: number;
        let Tx: number;
        let Ty: number;


        const { x: mouseLocalX, y: mouseLocalY } = toLocalMouse(clientX, clientY, resizeBase.current!, resizeCenter.current?.x, resizeCenter.current?.y);

        if (currentActiveHandle.id === "nw") {
            currentHandleX = mouseLocalX + BOX_PADDING;
            currentHandleY = mouseLocalY + BOX_PADDING;
        } else if (currentActiveHandle.id === "ne") {
            currentHandleX = mouseLocalX - BOX_PADDING;
            currentHandleY = mouseLocalY + BOX_PADDING;
        } else if (currentActiveHandle.id === "sw") {
            currentHandleX = mouseLocalX + BOX_PADDING;
            currentHandleY = mouseLocalY - BOX_PADDING;
        } else {
            currentHandleX = mouseLocalX - BOX_PADDING;
            currentHandleY = mouseLocalY - BOX_PADDING;
        }

        if (initialShape.type === "pencil") {

            const base = resizeBase.current!;
            const center = resizeCenter.current!;
            const bounds = resizeBounds.current!;

            let newLocalMinX = Math.min(localAnchor.current?.x!, currentHandleX);
            let newLocalMinY = Math.min(localAnchor.current?.y!, currentHandleY);
            let newLocalMaxX = Math.max(localAnchor.current?.x!, currentHandleX);
            let newLocalMaxY = Math.max(localAnchor.current?.y!, currentHandleY);

            const oldW = bounds.maxX - bounds.minX;
            const oldH = bounds.maxY - bounds.minY;
            const newW = newLocalMaxX - newLocalMinX;
            const newH = newLocalMaxY - newLocalMinY;

            const oldCenterX = (bounds.minX + bounds.maxX) / 2;
            const oldCenterY = (bounds.minY + bounds.maxY) / 2;

            const newCenterX = (newLocalMinX + newLocalMaxX) / 2;
            const newCenterY = (newLocalMinY + newLocalMaxY) / 2;

            const dx = currentHandleX - localAnchor.current!.x;
            const dy = currentHandleY - localAnchor.current!.y;

            const signX = Math.sign(dx) || 1;
            const signY = Math.sign(dy) || 1;

            const finalFlipX = resizeFlipRef.current!.x * signX
            const finalFlipY = resizeFlipRef.current!.y * signY


            const scaleX = finalFlipX * (newW / oldW);
            const scaleY = finalFlipY * (newH / oldH);

            const scaledLocalPoints = base.pointsInPath!.map(p => ({
                x: newCenterX + (p.x - oldCenterX) * scaleX,
                y: newCenterY + (p.y - oldCenterY) * scaleY
            }));

            const newLocalCenterX = (newLocalMinX + newLocalMaxX) / 2;
            const newLocalCenterY = (newLocalMinY + newLocalMaxY) / 2;

            const { x: worldCenterX, y: worldCenterY } = toWorldPoint(newLocalCenterX, newLocalCenterY, resizeBase.current!, resizeCenter.current?.x, resizeCenter.current?.y);

            const worldPoints = scaledLocalPoints?.map(pt => {
                const dx = pt.x - newLocalCenterX;
                const dy = pt.y - newLocalCenterY;

                return {
                    x: worldCenterX + dx,
                    y: worldCenterY + dy
                };
            });


            if (worldPoints === undefined) return;

            const newPath = new Path2D();
            newPath.moveTo(worldPoints[0]?.x!, worldPoints[0]?.y!);
            for (let i = 1; i < worldPoints.length; i++) {
                newPath.lineTo(worldPoints[i]?.x!, worldPoints[i]?.y!);
            }

            const updatedShape: Shape = {
                ...base,
                path: newPath,
                pointsInPath: worldPoints,
                startX: worldCenterX - newW / 2,
                startY: worldCenterY - newH / 2,
                endX: worldCenterX + newW / 2,
                endY: worldCenterY + newH / 2,
                rotation: base.rotation
            };

            setSelectedShape(updatedShape);
            mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            handleRedrawCanvas(mainCtx, tempCtx, shapes, true);

        } else if (initialShape.type === "text") {

        } else if (initialShape.type === "line") {

            const newLocalMinX = Math.min(localAnchor.current?.x!, currentHandleX);
            const newLocalMinY = Math.min(localAnchor.current?.y!, currentHandleY);
            const newLocalMaxX = Math.max(localAnchor.current?.x!, currentHandleX);
            const newLocalMaxY = Math.max(localAnchor.current?.y!, currentHandleY);

            const newLocalCenterX = (newLocalMinX + newLocalMaxX) / 2;
            const newLocalCenterY = (newLocalMinY + newLocalMaxY) / 2;

            const newLocalWidth = newLocalMaxX - newLocalMinX;
            const newLocalHeight = newLocalMaxY - newLocalMinY;

            const { x: worldCenterX, y: worldCenterY } = toWorldPoint(newLocalCenterX, newLocalCenterY, resizeBase.current!, resizeCenter.current?.x, resizeCenter.current?.y);

            const oldCenterX = (resizeBounds.current?.minX! + resizeBounds.current?.maxX!) / 2;
            const oldCenterY = (resizeBounds.current?.minY! + resizeBounds.current?.maxY!) / 2;

            const oldW = resizeBounds.current?.maxX! - resizeBounds.current?.minX!;
            const oldH = resizeBounds.current?.maxY! - resizeBounds.current?.minY!;

            const dx = currentHandleX - localAnchor.current!.x;
            const dy = currentHandleY - localAnchor.current!.y;

            const signX = Math.sign(dx) || 1;
            const signY = Math.sign(dy) || 1;

            const finalFlipX = resizeFlipRef.current!.x * signX
            const finalFlipY = resizeFlipRef.current!.y * signY

            const scaleX = finalFlipX * (newLocalWidth / oldW);
            const scaleY = finalFlipY * (newLocalHeight / oldH);

            let lineStartX = newLocalCenterX + (resizeBase.current?.lineCoordinates?.startX! - oldCenterX) * scaleX
            let lineStartY = newLocalCenterY + (resizeBase.current?.lineCoordinates?.startY! - oldCenterY) * scaleY
            let lineEndX = newLocalCenterX + (resizeBase.current?.lineCoordinates?.endX! - oldCenterX) * scaleX
            let lineEndY = newLocalCenterY + (resizeBase.current?.lineCoordinates?.endY! - oldCenterY) * scaleY

            lineStartX = worldCenterX + (lineStartX - newLocalCenterX);
            lineStartY = worldCenterY + (lineStartY - newLocalCenterY);
            lineEndX = worldCenterX + (lineEndX - newLocalCenterX);
            lineEndY = worldCenterY + (lineEndY - newLocalCenterY);

            let lineCoordinates = { startX: lineStartX, startY: lineStartY, endX: lineEndX, endY: lineEndY };
            let updatedShape: Shape | null = null;

            updatedShape = {
                ...initialShape,
                startX: worldCenterX - newLocalWidth / 2,
                startY: worldCenterY - newLocalHeight / 2,
                endX: worldCenterX + newLocalWidth / 2,
                endY: worldCenterY + newLocalHeight / 2,
                rotation: resizeBase.current?.rotation,
                lineCoordinates
            };

            if (updatedShape) {
                setSelectedShape(updatedShape);
                mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
            }
        } else {
            const newLocalMinX = Math.min(localAnchor.current?.x!, currentHandleX);
            const newLocalMinY = Math.min(localAnchor.current?.y!, currentHandleY);
            const newLocalMaxX = Math.max(localAnchor.current?.x!, currentHandleX);
            const newLocalMaxY = Math.max(localAnchor.current?.y!, currentHandleY);

            let updatedShape: Shape | null = null;

            const newLocalCenterX = (newLocalMinX + newLocalMaxX) / 2;
            const newLocalCenterY = (newLocalMinY + newLocalMaxY) / 2;

            const newLocalWidth = newLocalMaxX - newLocalMinX;
            const newLocalHeight = newLocalMaxY - newLocalMinY;

            const { x: worldCenterX, y: worldCenterY } = toWorldPoint(newLocalCenterX, newLocalCenterY, resizeBase.current!, resizeCenter.current?.x, resizeCenter.current?.y);

            updatedShape = {
                ...initialShape,
                startX: worldCenterX - newLocalWidth / 2,
                startY: worldCenterY - newLocalHeight / 2,
                endX: worldCenterX + newLocalWidth / 2,
                endY: worldCenterY + newLocalHeight / 2,
                rotation: resizeBase.current?.rotation
            };

            if (updatedShape) {
                setSelectedShape(updatedShape);
                mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
            }
        }
    }

    function handleRotate(mainCtx: React.RefObject<CanvasRenderingContext2D | null>, tempCtx: React.RefObject<CanvasRenderingContext2D | null>, clientX: number, clientY: number) {

        if (!initialShape || !currentActiveHandle) return;

        const centerX = (initialShape?.startX! + initialShape?.endX!) / 2;
        const centerY = (initialShape?.startY! + initialShape?.endY!) / 2;

        const rad = Math.atan2((clientY - centerY), (clientX - centerX)) + 1.5708;

        let updatedShape: Shape | null = null;

        updatedShape = {
            ...initialShape,
            rotation: rad
        };

        if (updatedShape) {
            setSelectedShape(updatedShape);
            mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
            handleRedrawCanvas(mainCtx, tempCtx, shapes, false, true);
        }
    }

    return [handleResizeRotate, handleResize, handleRotate];
}


