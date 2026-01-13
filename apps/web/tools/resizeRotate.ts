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

                console.log("Initial x, y : ", cx, cy);

                const minX = Math.min(boundsLeft!, boundsRight!);
                const minY = Math.min(boundsTop!, boundsBottom!);
                const maxX = Math.max(boundsLeft!, boundsRight!);
                const maxY = Math.max(boundsTop!, boundsBottom!);

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
            // anchorX = initialShape.endX!;
            // anchorY = initialShape.endY!;
            currentHandleX = mouseLocalX + BOX_PADDING;
            currentHandleY = mouseLocalY + BOX_PADDING;
        } else if (currentActiveHandle.id === "ne") {
            // anchorX = initialShape.startX!;
            // anchorY = initialShape.endY!;
            currentHandleX = mouseLocalX - BOX_PADDING;
            currentHandleY = mouseLocalY + BOX_PADDING;
        } else if (currentActiveHandle.id === "sw") {
            // anchorX = initialShape.endX!;
            // anchorY = initialShape.startY!;
            currentHandleX = mouseLocalX + BOX_PADDING;
            currentHandleY = mouseLocalY - BOX_PADDING;
        } else {
            // anchorX = initialShape.startX!;
            // anchorY = initialShape.startY!;
            currentHandleX = mouseLocalX - BOX_PADDING;
            currentHandleY = mouseLocalY - BOX_PADDING;
        }

        if (initialShape.type === "pencil") {
            console.log("Initial: " + initialShape.pointsInPath);
            console.log("Selected: " + selectedShape?.pointsInPath)
            Tx = currentActiveHandle.centerX - localAnchor.current?.x!;
            Ty = currentActiveHandle.centerY - localAnchor.current?.y!;
            if (Tx === 0 || Ty === 0) return;

            let currentX = currentHandleX - localAnchor.current?.x!;
            let currentY = currentHandleY - localAnchor.current?.y!;

            let scaleX = currentX / Tx;
            let scaleY = currentY / Ty;

            let points = initialShape.pointsInPath?.map(point => ({
                x: localAnchor.current?.x! + (point.x - localAnchor.current?.x!) * scaleX,
                y: localAnchor.current?.y! + (point.y - localAnchor.current?.y!) * scaleY
            }));
            let newMinX = localAnchor.current?.x! + (initialShape.startX! - localAnchor.current?.x!) * scaleX;
            let newMinY = localAnchor.current?.y! + (initialShape.startY! - localAnchor.current?.y!) * scaleY;
            let newMaxX = localAnchor.current?.x! + (initialShape.endX! - localAnchor.current?.x!) * scaleX;
            let newMaxY = localAnchor.current?.y! + (initialShape.endY! - localAnchor.current?.y!) * scaleY;

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
                }

            }
        } else if (initialShape.type === "text") {

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

            console.log("Frozen center:", resizeCenter.current);
            console.log("Live center:",
                worldCenterX,
                worldCenterY
            );


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


