import { useRecoilState, useRecoilValue } from "recoil";
import { originalSnapshot, shapesArray, shapeSelected } from "../recoil/atoms";
import { useRef } from "react";
import { Shape } from "@repo/types";
import { useRedrawCanvas } from "../app/utils/redraw";

export function useTranslate(): [
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
    const initialMouse = useRef<{ x: number, y: number }>();
    const initialShape = useRecoilValue(originalSnapshot);
    const handleRedrawCanvas = useRedrawCanvas();
    const shapes = useRecoilValue(shapesArray);

    function handleTranslateClick(mainCtx: React.RefObject<CanvasRenderingContext2D | null>,
        tempCtx: React.RefObject<CanvasRenderingContext2D | null>,
        clientX: number,
        clientY: number) {
        initialMouse.current = {
            x: clientX,
            y: clientY
        }
    }

    function handleTranslate(mainCtx: React.RefObject<CanvasRenderingContext2D | null>,
        tempCtx: React.RefObject<CanvasRenderingContext2D | null>,
        clientX: number,
        clientY: number) {

        if (initialShape?.type === "pencil") {

            const dx = clientX - initialMouse.current?.x!;
            const dy = clientY - initialMouse.current?.y!;

            let updatedShape: Shape | null = null;

            let startX = initialShape!.startX! + dx;
            let startY = initialShape!.startY! + dy;
            let endX = initialShape!.endX! + dx;
            let endY = initialShape!.endY! + dy;

            const translatedPoints = initialShape.pointsInPath?.map((point) => {
                return {
                    x: point.x + dx,
                    y: point.y + dy
                }
            })

            if(translatedPoints === undefined) return;

            const newPath = new Path2D();
            newPath.moveTo(translatedPoints[0]?.x!, translatedPoints[0]?.y!);
            for (let i = 1; i < translatedPoints.length; i++) {
                newPath.lineTo(translatedPoints[i]?.x!, translatedPoints[i]?.y!);
            }

            updatedShape = {
                ...initialShape!,
                startX,
                startY,
                endX,
                endY,
                pointsInPath: translatedPoints,
                path: newPath
            }

            if (updatedShape) {
                setSelectedShape(updatedShape);
                mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
            }


        } else if (initialShape?.type === "text") {

        } else if (initialShape?.type === "line") {
            const dx = clientX - initialMouse.current?.x!;
            const dy = clientY - initialMouse.current?.y!;

            let updatedShape: Shape | null = null;

            let startX = initialShape!.startX! + dx;
            let startY = initialShape!.startY! + dy;
            let endX = initialShape!.endX! + dx;
            let endY = initialShape!.endY! + dy;

            let lineCoordinates = {
                startX: initialShape.lineCoordinates?.startX! + dx,
                startY: initialShape.lineCoordinates?.startY! + dy,
                endX: initialShape.lineCoordinates?.endX! + dx,
                endY: initialShape.lineCoordinates?.endY! + dy
            }

            updatedShape = {
                ...initialShape!,
                startX,
                startY,
                endX,
                endY,
                lineCoordinates
            }

            if (updatedShape) {
                setSelectedShape(updatedShape);
                mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
            }
        } else {
            const dx = clientX - initialMouse.current?.x!;
            const dy = clientY - initialMouse.current?.y!;

            let updatedShape: Shape | null = null;

            let startX = initialShape!.startX! + dx;
            let startY = initialShape!.startY! + dy;
            let endX = initialShape!.endX! + dx;
            let endY = initialShape!.endY! + dy;

            updatedShape = {
                ...initialShape!,
                startX,
                startY,
                endX,
                endY
            }

            if (updatedShape) {
                setSelectedShape(updatedShape);
                mainCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
                handleRedrawCanvas(mainCtx, tempCtx, shapes, true);
            }
        }
    }

    return [handleTranslateClick, handleTranslate];
}