'use client';

import { MouseEvent, useState } from "react";
import { useEffect, useRef } from "react";
import { pencilDraw } from "../drawingLogic/pencil";
import { useRecoilState, useRecoilValue } from "recoil";
import { clearCanvas, cursorState, originalSnapshot, shapesArray, shapeSelected, strokeColor, strokeWidth, toolSelected, undoClicked, } from "../recoil/atoms";
import { boxDraw } from "../drawingLogic/box";
import { ellipseDraw } from "../drawingLogic/ellipse";
import { lineDraw } from "../drawingLogic/line";
import type { Shape, Point } from "@repo/types"
import { undo } from "../app/undo-redo/undo";
import { redo } from "../app/undo-redo/redo";
import useSelect from "../tools/select";
import useHover from "../tools/hover";
import useResizeRotateHover from "../tools/resizeRotateHover";
import useResizeRotate from "../tools/resizeRotate";
import BoundingBox from "../tools/boundingBox";
import { useRedrawCanvas } from "../app/utils/redraw";
import { useTranslate } from "../tools/translate";

export default function Canvas() {
    const mainCanvas = useRef<HTMLCanvasElement>(null);
    const tempCanvas = useRef<HTMLCanvasElement>(null);
    const mainCtx = useRef<CanvasRenderingContext2D | null>(null);
    const tempCtx = useRef<CanvasRenderingContext2D | null>(null);
    const isPainting = useRef<boolean>(false);
    const isResizing = useRef<boolean>(false);
    const isRotating = useRef<boolean>(false);
    const isTranslating = useRef<boolean>(false);
    const currentToolSelected = useRecoilValue(toolSelected);
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);
    const currentPath = useRef<Path2D>();

    const [shapes, setShapes] = useRecoilState(shapesArray);
    const [shapesId, setShapesId] = useState(crypto.randomUUID());

    const currentStrokeColor = useRecoilValue(strokeColor);
    const currentStrokeWidth = useRecoilValue(strokeWidth);

    const [textInput, setTextInput] = useState<{
        x: number;
        y: number;
        visible: boolean;
    }>({ x: 0, y: 0, visible: false });


    let minX: number, minY: number, maxX: number, maxY: number;
    let points: Point[] = [];

    const [isClearCanvas, setClearCanvas] = useRecoilState(clearCanvas);

    const [currentCursor, setCurrentCursor] = useRecoilState(cursorState);
    const handleSelect = useSelect();
    const handleHover = useHover();
    const handleResizeRotateHover = useResizeRotateHover();
    const [handleResizeRotate, handleResize, handleRotate] = useResizeRotate();
    const [selectedShape, setSelectedShape] = useRecoilState(shapeSelected);
    const [initialSnapshot, setInitialSnapshot] = useRecoilState(originalSnapshot);
    const [handleTranslateClick, handleTranslate] = useTranslate();
    const [undoClick, setUndoClick] = useRecoilState(undoClicked);

    const reDrawCanvas = useRedrawCanvas();


    useEffect(() => {
        mainCtx.current = mainCanvas.current!.getContext('2d');
        tempCtx.current = tempCanvas.current!.getContext('2d');

        const resizeCanvas = () => {
            mainCanvas.current!.width = window.innerWidth;
            mainCanvas.current!.height = window.innerHeight;
            tempCanvas.current!.width = window.innerWidth;
            tempCanvas.current!.height = window.innerHeight;

            reDrawCanvas(mainCtx, tempCtx, shapes);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // initial sizing

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []); // run once

    // Handle clear canvas
    useEffect(() => {
        if (isClearCanvas) {
            mainCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
            setClearCanvas(false);
        }
    }, [isClearCanvas]);

    // Handle triggered redraw
    useEffect(() => {
        console.log("3");
        mainCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
        reDrawCanvas(mainCtx, tempCtx, shapes, isResizing.current, isRotating.current);
    }, [shapes]);

    useEffect(() => {
        if (!selectedShape) return;

        const newSelectedShape = { ...selectedShape, strokeColor: currentStrokeColor, strokeWidth: currentStrokeWidth }
        setSelectedShape(newSelectedShape);
        const newShapes = shapes.map((shape) => {
            if (shape.id === selectedShape?.id) {
                return { ...shape, strokeColor: currentStrokeColor, strokeWidth: currentStrokeWidth };
            } else {
                return shape;
            }
        })

        setShapes(newShapes);
        undo.push(newShapes);

    }, [currentStrokeColor, currentStrokeWidth])

    useEffect(() => {
        tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);
        setUndoClick(false);
    }, [undoClick])

    function startPainting(e: MouseEvent) {

        if (currentCursor.endsWith("resize")) {
            isResizing.current = true;
            setInitialSnapshot(selectedShape);
            handleResizeRotate(mainCtx, e.clientX, e.clientY);
            // handleResize(mainCtx, tempCtx, e.clientX, e.clientY);
            // draw(e);
            return;
        } else if (currentCursor.endsWith("grab")) {
            isRotating.current = true;
            setInitialSnapshot(selectedShape);
            handleResizeRotate(mainCtx, e.clientX, e.clientY);
            // handleRotate(mainCtx, tempCtx, e.clientX, e.clientY);
            // draw(e);
            return;
        } else if (currentToolSelected === "select" && !isTranslating.current) {
            handleSelect(mainCtx, tempCtx, e.clientX, e.clientY);
            if (selectedShape) {
                setInitialSnapshot(selectedShape);
                handleTranslateClick(mainCtx, tempCtx, e.clientX, e.clientY);
                isTranslating.current = true;
            }
            return;
        }



        isPainting.current = true;

        startX.current = e.clientX;
        startY.current = e.clientY;

        if (currentToolSelected === "text") {
            setTextInput({ x: e.clientX, y: e.clientY, visible: true });
            isPainting.current = false; // stop further drawing
        } else if (currentToolSelected === "pencil") {
            minX = e.clientX;
            minY = e.clientY;
            maxX = 0;
            maxY = 0;
            currentPath.current = new Path2D();
            draw(e);
        } else {
            draw(e);
        }
    }

    function stopPainting(e: MouseEvent) {
        if (isResizing.current || isRotating.current || isTranslating.current) {
            setInitialSnapshot(undefined)
            tempCtx.current?.clearRect(0, 0, window.innerWidth, window.innerHeight);

            let anyChange = false;
            const newShapes = shapes.map((shape) => {
                if (shape.id === selectedShape?.id) {
                    if (shape !== selectedShape) {
                        anyChange = true;
                    }
                    return selectedShape;
                } else {
                    return shape;
                }
            })
            isRotating.current = false;
            isResizing.current = false;
            isTranslating.current = false;
            setShapes(newShapes);
            if (anyChange) {
                undo.push(newShapes);
            }
        }
        if (isPainting.current) {

            isPainting.current = false;

            if (currentToolSelected === "pencil") {

                setShapes(prev => {
                    const newShapes: Shape[] = [...prev, {
                        id: shapesId,
                        type: "pencil",
                        path: currentPath.current as Path2D,
                        strokeColor: currentStrokeColor,
                        strokeWidth: currentStrokeWidth,
                        startX: minX,
                        startY: minY,
                        endX: maxX,
                        endY: maxY,
                        pointsInPath: points,
                        rotation: 0
                    }];
                    undo.push(newShapes);
                    return newShapes;
                });
                redo.length = 0;
                setShapesId(crypto.randomUUID());

                tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
                pencilDraw(mainCtx, startX.current, startY.current, currentPath.current as Path2D, false, currentStrokeColor, currentStrokeWidth);

            } else if (currentToolSelected === "box") {
                setShapes(s => {
                    const newShapes: Shape[] = [...s, {
                        id: shapesId,
                        type: "box",
                        startX: startX.current,
                        startY: startY.current,
                        endX: e.clientX,
                        endY: e.clientY,
                        strokeColor: currentStrokeColor,
                        strokeWidth: currentStrokeWidth,
                        rotation: 0
                    }]
                    undo.push(newShapes);
                    return newShapes;
                })
                redo.length = 0;
                setShapesId(crypto.randomUUID());

                tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
                boxDraw(mainCtx, startX.current, startY.current, e.clientX, e.clientY, false, currentStrokeColor, currentStrokeWidth);
            } else if (currentToolSelected === "ellipse") {
                setShapes(s => {
                    const newShapes: Shape[] = [...s, {
                        id: shapesId,
                        type: "ellipse",
                        startX: startX.current,
                        startY: startY.current,
                        endX: e.clientX,
                        endY: e.clientY,
                        rotation: 0,
                        strokeColor: currentStrokeColor,
                        strokeWidth: currentStrokeWidth,
                    }]
                    undo.push(newShapes);
                    return newShapes;
                })
                redo.length = 0;
                setShapesId(crypto.randomUUID());

                tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
                ellipseDraw(mainCtx, startX.current, startY.current, e.clientX, e.clientY, false, currentStrokeColor, currentStrokeWidth);
            } else if (currentToolSelected === "line") {
                setShapes(s => {
                    const newShapes: Shape[] = [...s, {
                        id: shapesId,
                        type: "line",
                        startX: startX.current,
                        startY: startY.current,
                        endX: e.clientX,
                        endY: e.clientY,
                        strokeColor: currentStrokeColor,
                        strokeWidth: currentStrokeWidth,
                        rotation: 0,
                        lineCoordinates: { startX: startX.current, startY: startY.current, endX: e.clientX, endY: e.clientY }
                    }]
                    undo.push(newShapes);
                    return newShapes;
                })
                redo.length = 0;
                setShapesId(crypto.randomUUID());

                tempCtx.current!.clearRect(0, 0, window.innerWidth, window.innerHeight);
                lineDraw(mainCtx, startX.current, startY.current, e.clientX, e.clientY, false, currentStrokeColor, currentStrokeWidth);
            } else if (currentToolSelected === "text") {

            }
            mainCtx.current!.beginPath();
        }
    }

    function draw(e: MouseEvent) {
        if (!isPainting.current && !isResizing.current && !isRotating.current && !isTranslating.current) {
            const isShape = handleHover(tempCtx, e.clientX, e.clientY);
            if (isShape && currentToolSelected === "select") {
                setCurrentCursor("cursor-move");
            } else if (currentToolSelected !== "select") {
                setCurrentCursor("cursor-crosshair");
            } else {
                setCurrentCursor("cursor-default")
            }
            if (shapeSelected !== undefined && currentToolSelected === "select" && !isPainting.current) {
                handleResizeRotateHover(tempCtx, e.clientX, e.clientY);
            }
            return;
        };
        if (!isPainting.current && !isRotating.current && isResizing.current && !isTranslating.current) {
            handleResize(mainCtx, tempCtx, e.clientX, e.clientY);
            return;
        }
        if (!isPainting.current && !isResizing.current && isRotating.current && !isTranslating.current) {
            handleRotate(mainCtx, tempCtx, e.clientX, e.clientY);
            return;
        }
        if (!isPainting.current && !isRotating.current && !isResizing.current && isTranslating.current) {
            handleTranslate(mainCtx, tempCtx, e.clientX, e.clientY);
            return;
        }
        if (currentToolSelected === "pencil") {
            minX = Math.min(e.clientX, minX);
            minY = Math.min(e.clientY, minY);
            maxX = Math.max(e.clientX, maxX);
            maxY = Math.max(e.clientY, maxY);
            let point = { x: e.clientX, y: e.clientY };
            points.push(point);

            pencilDraw(tempCtx, e.clientX, e.clientY, currentPath.current as Path2D, true, currentStrokeColor, currentStrokeWidth);
        } else if (currentToolSelected === "box") {
            boxDraw(tempCtx, startX.current, startY.current, e.clientX, e.clientY, true, currentStrokeColor, currentStrokeWidth);
        } else if (currentToolSelected === "ellipse") {
            ellipseDraw(tempCtx, startX.current, startY.current, e.clientX, e.clientY, true, currentStrokeColor, currentStrokeWidth);
        } else if (currentToolSelected === "line") {
            lineDraw(tempCtx, startX.current, startY.current, e.clientX, e.clientY, true, currentStrokeColor, currentStrokeWidth);
        }
    }

    return (
        <>
            <div className="relative w-screen h-screen">
                <canvas ref={mainCanvas} className={`absolute top-0 left-0 z-0 ${currentCursor}`} />
                <canvas className={`absolute top-0 left-0 z-10 ${currentCursor}`} onMouseDown={(e) => startPainting(e)} onMouseUp={(e) => stopPainting(e)} onMouseMove={(e) => draw(e)} ref={tempCanvas} />
                {currentToolSelected === "text" && textInput.visible && (
                    <textarea
                        className="absolute border px-1 py-0.5 text-sm text-black z-20 bg-white"
                        style={{ left: `${textInput.x}px`, top: `${textInput.y}px` }}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                mainCtx.current!.textBaseline = "top";
                                mainCtx.current!.textAlign = "left";
                                mainCtx.current!.fillText(e.currentTarget.value, textInput.x, textInput.y);
                                setTextInput(prev => ({ ...prev, visible: false }));
                            }
                        }}
                    />
                )}
            </div>
        </>
    )
}